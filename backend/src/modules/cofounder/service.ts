import { prisma } from "../../config/db.js";
import { llmService } from "../../utils/llmService.js";
import { vectorStore } from "../../utils/vectorStore.js";
import { CofounderResponseSchema } from "../../utils/schemas.js";
import { personaPrompts, PersonaMode } from "./personas.js";
import { logger } from "../../utils/logger.js";

export async function askCofounder(
  tenantId: string,
  question: string,
  persona: PersonaMode = "default"
) {
  // 1) Fetch active startup
  const activeStartup = await prisma.startupIdea.findFirst({
    where: { tenantId, published: false },
    orderBy: { createdAt: "desc" },
  });

  // 2) Fetch recent memories
  const memories = await prisma.memory.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // 3) Embed question and query vector store
  const questionEmbedding = await vectorStore.embedText(question);
  const relevantMemories = await vectorStore.queryTopK(tenantId, questionEmbedding, 5);

  // 4) Build system prompt
  const personaPrompt = personaPrompts[persona] || personaPrompts.default;
  
  const contextMemories = relevantMemories.length > 0
    ? relevantMemories.map((m) => `Memory: ${m.text}`).join("\n")
    : memories.slice(0, 6).map((m) => `Memory: ${m.text}`).join("\n");

  const startupContext = activeStartup
    ? `ActiveStartup: ${JSON.stringify({
        title: activeStartup.title,
        oneLiner: activeStartup.oneLiner,
        stage: activeStartup.published ? "published" : "draft",
      })}`
    : "No active startup yet.";

  const systemPrompt = `${personaPrompt}

Context:
${startupContext}

Relevant Memories:
${contextMemories}

Remember: Always return valid JSON only. No markdown, no code blocks, just pure JSON.`;

  // 5) Call LLM
  const rawResponse = await llmService.chat(systemPrompt, question);

  // 6) Parse and validate JSON
  let parsed;
  try {
    const jsonStr = rawResponse.trim();
    // Remove markdown code blocks if present
    const cleaned = jsonStr.replace(/^```json\n?/g, "").replace(/```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (error) {
    logger.error("Failed to parse LLM response", error as Error, { rawResponse });
    // Fallback response
    parsed = {
      immediate: "Let me help you with that. Can you provide more context?",
      plan: [],
      risk: "Unable to process request",
      tasks: [],
    };
  }

  // 7) Validate against schema
  const validated = CofounderResponseSchema.safeParse(parsed);
  if (!validated.success) {
    logger.warn("LLM response validation failed", { errors: validated.error });
    // Use parsed anyway but log warning
  }

  const response = validated.success ? validated.data : parsed;

  // 8) Save memory asynchronously (don't await)
  const importanceScore = question.length > 50 ? 0.7 : 0.5;
  if (importanceScore >= 0.5) {
    prisma.memory
      .create({
        data: {
          tenantId,
          text: `Q: ${question}\nA: ${JSON.stringify(response)}`,
          tags: ["cofounder:qa", `persona:${persona}`],
          importance: importanceScore,
          autoSaved: true,
        },
      })
      .then(() => {
        // Embed and store in vector DB asynchronously
        vectorStore.embedText(`Q: ${question}\nA: ${JSON.stringify(response)}`).then((embedding) => {
          // Update memory with embedding
          prisma.memory.updateMany({
            where: { tenantId, text: { contains: question } },
            data: { embedding: embedding as any },
          });
        });
      })
      .catch((err) => logger.error("Failed to save memory", err));
  }

  return {
    ...response,
    sourceMemories: relevantMemories.map((m) => ({ id: m.id, text: m.text, score: m.score })),
  };
}

export async function getMemories(tenantId: string, limit = 20) {
  return prisma.memory.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      text: true,
      tags: true,
      createdAt: true,
      importance: true,
    },
  });
}

export async function createMemory(tenantId: string, text: string, tags: string[] = []) {
  const embedding = await vectorStore.embedText(text);
  
  return prisma.memory.create({
    data: {
      tenantId,
      text,
      tags,
      embedding: embedding as any,
      importance: 0.6,
      autoSaved: false,
    },
  });
}

