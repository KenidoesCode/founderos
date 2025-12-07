import OpenAI from "openai";
import { config } from "../config/env.js";
import { logger } from "./logger.js";

const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

export const llmService = {
  async chat(systemPrompt: string, userPrompt: string, temperature = 0.2, maxTokens = 2000): Promise<string> {
    if (config.useMocks) {
      return JSON.stringify({
        immediate: "Mock response: Ship the landing page today",
        plan: [{ step: "Build landing page", time: "30m" }],
        risk: "Low risk",
        tasks: [{ title: "Create landing page", estimate: "30m" }],
      });
    }

    if (!openai) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const response = await openai.chat.completions.create({
        model: config.openaiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
        top_p: 0.9,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from LLM");
      }

      return content;
    } catch (error) {
      logger.error("LLM service error", error as Error);
      throw error;
    }
  },

  async embed(text: string): Promise<number[]> {
    if (config.useMocks) {
      // Return mock embedding vector (1536 dimensions)
      return new Array(1536).fill(0).map(() => Math.random());
    }

    if (!openai) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const response = await openai.embeddings.create({
        model: config.embeddingsModel,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error("Embedding service error", error as Error);
      throw error;
    }
  },
};

