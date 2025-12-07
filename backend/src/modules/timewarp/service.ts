import { prisma } from "../../config/db.js";
import { llmService } from "../../utils/llmService.js";
import { TimeWarpResponseSchema } from "../../utils/schemas.js";
import { logger } from "../../utils/logger.js";

async function getStreakDays(tenantId: string): Promise<number> {
  const streak = await prisma.streak.findUnique({ where: { tenantId } });
  if (!streak) return 0;
  
  const now = new Date();
  const lastActive = new Date(streak.lastActiveAt);
  const daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSince === 0) {
    return streak.currentDays;
  } else if (daysSince === 1) {
    return streak.currentDays + 1;
  } else {
    return 0; // Streak broken
  }
}

async function getTasksCompletedLast7(tenantId: string): Promise<number> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const count = await prisma.task.count({
    where: {
      tenantId,
      status: "completed",
      completedAt: { gte: sevenDaysAgo },
    },
  });
  
  return count;
}

async function getOpenTasksCount(tenantId: string): Promise<number> {
  return prisma.task.count({
    where: {
      tenantId,
      status: { in: ["pending", "in_progress"] },
    },
  });
}

async function getLateNightCount(tenantId: string): Promise<number> {
  // For MVP, return 0 (would need activity tracking)
  return 0;
}

async function getStartupMaturityScore(tenantId: string): Promise<number> {
  const startups = await prisma.startupIdea.count({ where: { tenantId } });
  const published = await prisma.startupIdea.count({ where: { tenantId, published: true } });
  const tasks = await prisma.task.count({ where: { tenantId, status: "completed" } });
  
  // Simple heuristic: 0-5 scale
  let score = 0;
  if (startups > 0) score += 1;
  if (published > 0) score += 2;
  if (tasks > 5) score += 1;
  if (tasks > 20) score += 1;
  
  return Math.min(5, score);
}

function pickFeatureSuggestion(tenantId: string, maturity: number): string {
  if (maturity < 1) return "Build your first landing page";
  if (maturity < 2) return "Launch outreach campaign";
  if (maturity < 3) return "Add pricing page and payment";
  if (maturity < 4) return "Optimize conversion funnel";
  return "Scale to next growth stage";
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function computeTimeWarp(tenantId: string) {
  // 1) Load metrics
  const streakDays = await getStreakDays(tenantId);
  const tasksCompleted7 = await getTasksCompletedLast7(tenantId);
  const openTasks = await getOpenTasksCount(tenantId);
  const lateNightCount = await getLateNightCount(tenantId);
  const startupMaturity = await getStartupMaturityScore(tenantId);

  // 2) Weights
  const w1 = 0.3;
  const w2 = 0.4;
  const w3 = 0.2;
  const w4 = 0.1;
  const w5 = 0.5;

  // 3) Compute score
  const score =
    w1 * streakDays +
    w2 * (tasksCompleted7 / 7) -
    w3 * lateNightCount -
    w4 * openTasks +
    w5 * startupMaturity;

  // 4) Map score to confidence (normalize to 0-1)
  const confidence = Math.max(0, Math.min(1, score / 10));

  // 5) Pick feature
  const feature = pickFeatureSuggestion(tenantId, startupMaturity);

  // 6) Compute date window
  const now = new Date();
  const startOffsetDays = Math.max(1, Math.round((1 - confidence) * 7));
  const endOffsetDays = startOffsetDays + 7;

  const dateWindow = `${formatDate(addDays(now, startOffsetDays))} to ${formatDate(addDays(now, endOffsetDays))}`;

  // 7) Generate explanation using LLM
  const explanationPrompt = `Based on these metrics:
- Streak: ${streakDays} days
- Tasks completed (7d): ${tasksCompleted7}
- Open tasks: ${openTasks}
- Startup maturity: ${startupMaturity}/5

Generate a short explanation (1-2 sentences) for why "${feature}" is the predicted next feature and why the confidence is ${confidence.toFixed(2)}.`;

  let explanation: string;
  try {
    const llmResponse = await llmService.chat(
      "You are TimeWarp engine. Generate concise explanations for startup predictions.",
      explanationPrompt,
      0.5,
      200
    );
    const parsed = JSON.parse(llmResponse);
    explanation = parsed.explanation || parsed.message || `Based on your current progress, ${feature} is the highest ROI action.`;
  } catch (error) {
    logger.warn("Failed to generate LLM explanation", error as Error);
    explanation = `Based on streak ${streakDays}, recent velocity ${tasksCompleted7}/7, and maturity ${startupMaturity}, this feature yields highest ROI in the predicted window. Confidence ${confidence.toFixed(2)}.`;
  }

  const result = {
    feature,
    confidence,
    explanation,
    dateWindow,
  };

  // Validate
  const validated = TimeWarpResponseSchema.safeParse(result);
  if (!validated.success) {
    logger.warn("TimeWarp validation failed", { errors: validated.error });
  }

  return validated.success ? validated.data : result;
}

