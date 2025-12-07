import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@founderos.app" },
    update: {},
    create: {
      email: "demo@founderos.app",
      name: "Keni Demo",
      password: hashedPassword,
    },
  });

  console.log("Created user:", user.email);

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "keni-demo" },
    update: {},
    create: {
      userId: user.id,
      name: "Keni Demo Org",
      slug: "keni-demo",
    },
  });

  console.log("Created tenant:", tenant.slug);

  // Create streak
  await prisma.streak.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      currentDays: 5,
      longestStreak: 12,
    },
  });

  // Create sample startups
  const startups = [
    {
      tenantId: tenant.id,
      slug: "founder-os",
      title: "FounderOS",
      oneLiner: "AI cofounder for builders",
      json: {
        title: "FounderOS",
        oneLiner: "AI cofounder for builders",
        problem: "Founders lack direction and accountability",
        solution: "AI cofounder that remembers, plans, and executes",
        landing: {
          headline: "Your AI Cofounder",
          subheadline: "Build startups faster with AI that remembers everything",
          bullets: ["Memory system", "Auto-startup generator", "Time-warp predictions"],
        },
        validationTasks: [
          { task: "Build landing page", metric: "50 signups", timeEstimate: "2h" },
          { task: "Run outreach campaign", metric: "10 responses", timeEstimate: "1h" },
        ],
        pricing: {
          free: "7-day trial",
          paid: "$24/month",
          enterprise: "Custom",
        },
        competitors: [
          { name: "ChatGPT", whyTheyFail: "No memory or startup context" },
          { name: "Notion", whyTheyFail: "Passive tool, not active cofounder" },
        ],
      },
      published: false,
    },
    {
      tenantId: tenant.id,
      slug: "micro-landing",
      title: "Micro Landing",
      oneLiner: "Landing page generator for MVPs",
      json: {
        title: "Micro Landing",
        oneLiner: "Landing page generator for MVPs",
        problem: "Building landing pages takes too long",
        solution: "AI-generated landing pages in minutes",
        landing: {
          headline: "Launch Your MVP Landing in Minutes",
          subheadline: "AI-powered landing page generator",
          bullets: ["Fast generation", "Mobile responsive", "SEO optimized"],
        },
        validationTasks: [
          { task: "Generate 3 landing pages", metric: "Test conversion", timeEstimate: "30m" },
        ],
        pricing: {
          free: "1 page free",
          paid: "$9/month",
          enterprise: "Unlimited",
        },
        competitors: [
          { name: "Webflow", whyTheyFail: "Too complex for MVPs" },
        ],
      },
      published: false,
    },
  ];

  for (const startup of startups) {
    await prisma.startupIdea.upsert({
      where: { slug: startup.slug },
      update: {},
      create: startup,
    });
  }

  console.log(`Created ${startups.length} startups`);

  // Create sample memories
  const memories = [
    {
      tenantId: tenant.id,
      userId: user.id,
      text: "Met with local founder, wants validation for cafe management tool",
      tags: ["meeting", "customer-interview"],
      importance: 0.8,
      autoSaved: false,
    },
    {
      tenantId: tenant.id,
      userId: user.id,
      text: "Built first landing page in 2 hours using FounderOS generator",
      tags: ["milestone", "execution"],
      importance: 0.7,
      autoSaved: false,
    },
    {
      tenantId: tenant.id,
      userId: user.id,
      text: "Pivoted to India-first SMB tools after market research",
      tags: ["pivot", "strategy"],
      importance: 0.9,
      autoSaved: false,
    },
    {
      tenantId: tenant.id,
      userId: user.id,
      text: "Tested landing A: 12 signups in first day",
      tags: ["experiment", "traction"],
      importance: 0.8,
      autoSaved: false,
    },
  ];

  for (const memory of memories) {
    await prisma.memory.create({ data: memory });
  }

  console.log(`Created ${memories.length} memories`);

  // Create sample tasks
  const tasks = [
    {
      tenantId: tenant.id,
      title: "Build landing page hero section",
      description: "Create compelling headline and CTA",
      estimate: "30m",
      status: "pending",
      priority: 1,
    },
    {
      tenantId: tenant.id,
      title: "Write outreach email sequence",
      description: "3-email sequence for cafe owners",
      estimate: "45m",
      status: "in_progress",
      priority: 2,
    },
    {
      tenantId: tenant.id,
      title: "Set up analytics tracking",
      description: "Install Google Analytics and event tracking",
      estimate: "20m",
      status: "completed",
      priority: 0,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Created ${tasks.length} tasks`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

