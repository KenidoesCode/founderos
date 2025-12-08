import { llmService } from "../../utils/llmService.js";
import { logger } from "../../utils/logger.js";
import { analysisPrompt } from "./personas.js";

export async function runAnalysis(idea: string) {
  const systemPrompt = `
${analysisPrompt}

Startup Idea: "${idea}"
Return JSON only.
`;

  const raw = await llmService.chat(systemPrompt, idea);

  let parsed;
  try {
    const cleaned = raw.replace(/^```json/, "").replace(/```$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    logger.error("AI Analysis JSON parse failed", err, { raw });

    parsed = {
      summary: "Unable to process idea",
      competitorCount: 0,
      saturationScore: 0,
      topCompetitors: [],
      marketLandscape: {
        primaryMarket: "Unknown",
        adjacentMarkets: [],
        entryBarriers: [],
        idealCustomers: []
      },
      strengths: [],
      weaknesses: [],
      opportunityScore: 0,
      positioning: "Insufficient information."
    };
  }

  return parsed;
}
