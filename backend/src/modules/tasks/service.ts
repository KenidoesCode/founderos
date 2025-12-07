import { prisma } from "../../config/db.js";

export async function getTasks(tenantId: string, status?: string) {
  return prisma.task.findMany({
    where: {
      tenantId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(tenantId: string, data: {
  title: string;
  description?: string;
  estimate?: string;
  priority?: number;
}) {
  return prisma.task.create({
    data: {
      tenantId,
      title: data.title,
      description: data.description,
      estimate: data.estimate,
      priority: data.priority || 0,
      status: "pending",
    },
  });
}

export async function updateTask(tenantId: string, taskId: string, data: {
  status?: string;
  title?: string;
  description?: string;
}) {
  return prisma.task.updateMany({
    where: { id: taskId, tenantId },
    data: {
      ...data,
      ...(data.status === "completed" ? { completedAt: new Date() } : {}),
    },
  });
}

export async function deleteTask(tenantId: string, taskId: string) {
  return prisma.task.deleteMany({
    where: { id: taskId, tenantId },
  });
}

