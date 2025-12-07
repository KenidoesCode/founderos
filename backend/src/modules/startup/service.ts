import { prisma } from "../../config/db.js";
import { llmService } from "../../utils/llmService.js";
import { StartupJSONSchema } from "../../utils/schemas.js";
import { logger } from "../../utils/logger.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
}

function buildStartupPrompt(payload: {
  tags?: string[];
  market?: string;
  skillLevel?: string;
  budget?: string;
  geography?: string;
}): string {
  return `You are MicroStartupGenerator. Generate a validated startup idea based on:

Input: ${JSON.stringify(payload)}

Output STRICT JSON (no extra text):
{
  "title": "Startup name",
  "oneLiner": "One sentence description",
  "problem": "Clear problem statement",
  "solution": "Solution description",
  "landing": {
    "headline": "Compelling headline",
    "subheadline": "Supporting subheadline",
    "bullets": ["Key benefit 1", "Key benefit 2", "Key benefit 3"]
  },
  "validationTasks": [
    {"task": "Specific validation task", "metric": "Success metric", "timeEstimate": "15m"},
    {"task": "Another task", "metric": "Metric", "timeEstimate": "30m"},
    {"task": "Third task", "metric": "Metric", "timeEstimate": "45m"}
  ],
  "pricing": {
    "free": "Free tier description",
    "paid": "Paid tier description",
    "enterprise": "Enterprise tier description"
  },
  "competitors": [
    {"name": "Real competitor name", "whyTheyFail": "One-line weakness"},
    {"name": "Another competitor", "whyTheyFail": "Weakness"}
  ]
}

Competitors must be real or plausible. Provide 3 validation tasks with concrete actions. Always return valid JSON only.`;
}

export async function generateStartup(tenantId: string, payload: {
  tags?: string[];
  market?: string;
  skillLevel?: string;
  budget?: string;
  geography?: string;
}) {
  const prompt = buildStartupPrompt(payload);
  
  const rawResponse = await llmService.chat(prompt, "", 0.7, 3000);
  
  let parsed;
  try {
    const jsonStr = rawResponse.trim().replace(/^```json\n?/g, "").replace(/```$/g, "").trim();
    parsed = JSON.parse(jsonStr);
  } catch (error) {
    logger.error("Failed to parse startup generator response", error as Error, { rawResponse });
    throw new Error("Failed to generate startup idea");
  }

  const validated = StartupJSONSchema.safeParse(parsed);
  if (!validated.success) {
    logger.warn("Startup generator validation failed", { errors: validated.error });
    if (!parsed.title || !parsed.oneLiner) {
      throw new Error("Invalid startup generator output");
    }
  }

  const startupData = validated.success ? validated.data : parsed;

  const created = await prisma.startupIdea.create({
    data: {
      tenantId,
      slug: slugify(startupData.title),
      title: startupData.title,
      oneLiner: startupData.oneLiner,
      json: startupData as any,
      published: false,
    },
  });

  return created;
}

export async function getStartups(tenantId: string) {
  return prisma.startupIdea.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStartup(tenantId: string, slug: string) {
  return prisma.startupIdea.findFirst({
    where: { tenantId, slug },
  });
}

export async function publishStartup(tenantId: string, slug: string) {
  return prisma.startupIdea.updateMany({
    where: { tenantId, slug },
    data: { published: true },
  });
}

