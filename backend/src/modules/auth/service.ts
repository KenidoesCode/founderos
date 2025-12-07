import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import { signToken } from "../../utils/jwt.js";
import { logger } from "../../utils/logger.js";

export async function register(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    },
  });

  // Create default tenant
  const tenant = await prisma.tenant.create({
    data: {
      userId: user.id,
      name: `${user.name}'s Workspace`,
      slug: `${user.name?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    },
  });

  // Create initial streak
  await prisma.streak.create({
    data: {
      tenantId: tenant.id,
      currentDays: 0,
      longestStreak: 0,
    },
  });

  const token = signToken({
    userId: user.id,
    tenantId: tenant.id,
    email: user.email || undefined,
  });

  return { user, tenant, token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  // Get or create tenant
  let tenant = await prisma.tenant.findFirst({ where: { userId: user.id } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        userId: user.id,
        name: `${user.name}'s Workspace`,
        slug: `${user.name?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      },
    });
  }

  const token = signToken({
    userId: user.id,
    tenantId: tenant.id,
    email: user.email || undefined,
  });

  return { user, tenant, token };
}

