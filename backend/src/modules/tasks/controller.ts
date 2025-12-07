import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import * as taskService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function list(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const status = req.query.status as string | undefined;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const tasks = await taskService.getTasks(tenantId, status);

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    logger.error("List tasks error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { title, description, estimate, priority } = req.body;

    if (!tenantId || !title) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and title required", code: "BAD_REQUEST" },
      });
    }

    const task = await taskService.createTask(tenantId, {
      title,
      description,
      estimate,
      priority,
    });

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    logger.error("Create task error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const taskId = req.params.id;
    const { status, title, description } = req.body;

    if (!tenantId || !taskId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and taskId required", code: "BAD_REQUEST" },
      });
    }

    await taskService.updateTask(tenantId, taskId, { status, title, description });

    return res.json({
      success: true,
      data: { message: "Task updated" },
    });
  } catch (error) {
    logger.error("Update task error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const taskId = req.params.id;

    if (!tenantId || !taskId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and taskId required", code: "BAD_REQUEST" },
      });
    }

    await taskService.deleteTask(tenantId, taskId);

    return res.json({
      success: true,
      data: { message: "Task deleted" },
    });
  } catch (error) {
    logger.error("Delete task error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

