import { z } from "zod";

export const CofounderResponseSchema = z.object({
  immediate: z.string(),
  plan: z.array(z.object({
    step: z.string(),
    time: z.string(),
  })),
  risk: z.string(),
  tasks: z.array(z.object({
    title: z.string(),
    estimate: z.string(),
    details: z.string().optional(),
  })),
});

export const StartupJSONSchema = z.object({
  title: z.string(),
  oneLiner: z.string(),
  problem: z.string(),
  solution: z.string(),
  landing: z.object({
    headline: z.string(),
    subheadline: z.string(),
    bullets: z.array(z.string()),
  }),
  validationTasks: z.array(z.object({
    task: z.string(),
    metric: z.string(),
    timeEstimate: z.string(),
  })),
  pricing: z.object({
    free: z.string(),
    paid: z.string(),
    enterprise: z.string(),
  }),
  competitors: z.array(z.object({
    name: z.string(),
    whyTheyFail: z.string(),
  })),
});

export const TimeWarpResponseSchema = z.object({
  feature: z.string(),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  dateWindow: z.string(),
});

export const GenomeProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  traits: z.object({
    riskTolerance: z.number().min(0).max(1),
    speed: z.number().min(0).max(1),
    collaboration: z.number().min(0).max(1),
    marketObsession: z.number().min(0).max(1),
    resilience: z.number().min(0).max(1),
  }),
  milestones: z.array(z.object({
    date: z.string(),
    title: z.string(),
    desc: z.string(),
  })),
  lastUpdated: z.string(),
});

