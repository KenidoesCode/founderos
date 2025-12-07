import { config } from "../config/env.js";
import { prisma } from "../config/db.js";
import { logger } from "./logger.js";

interface VectorResult {
  id: string;
  text: string;
  score: number;
}

export const vectorStore = {
  async embedText(text: string): Promise<number[]> {
    // This will be implemented by llmService.embed
    const { llmService } = await import("./llmService.js");
    return llmService.embed(text);
  },

  async upsert(tenantId: string, id: string, vector: number[], payload: { text: string; tags?: string[] }) {
    if (config.vectorDbProvider === "pgvector") {
      // Store in Postgres with pgvector extension
      // For MVP, we'll store embeddings in JSON and query using cosine similarity
      await prisma.memory.update({
        where: { id },
        data: { embedding: vector as any },
      });
    } else if (config.vectorDbProvider === "pinecone") {
      // Pinecone implementation would go here
      logger.warn("Pinecone not yet implemented, using pgvector fallback");
    }
  },

  async queryTopK(tenantId: string, queryVector: number[], k = 5): Promise<VectorResult[]> {
    if (config.vectorDbProvider === "pgvector") {
      // For MVP: fetch recent memories and compute cosine similarity
      const memories = await prisma.memory.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 20, // Fetch more to compute similarity
      });

      // Simple cosine similarity (for production, use pgvector extension)
      const results = memories
        .filter((m) => m.embedding && Array.isArray(m.embedding))
        .map((m) => {
          const embedding = m.embedding as number[];
          const score = cosineSimilarity(queryVector, embedding);
          return {
            id: m.id,
            text: m.text,
            score,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

      return results;
    }

    return [];
  },
};

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

