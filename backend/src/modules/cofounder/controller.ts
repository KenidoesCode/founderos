import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import * as cofounderService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function ask(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { question, persona = "default" } = req.body;

    if (!tenantId || !question) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and question required", code: "BAD_REQUEST" },
      });
    }

    const answer = await cofounderService.askCofounder(tenantId, question, persona);

    return res.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    logger.error("Cofounder ask error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function getMemories(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const limit = parseInt(req.query.limit as string) || 20;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const memories = await cofounderService.getMemories(tenantId, limit);

    return res.json({
      success: true,
      data: memories,
    });
  } catch (error) {
    logger.error("Get memories error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function createMemory(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { text, tags = [] } = req.body;

    if (!tenantId || !text) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and text required", code: "BAD_REQUEST" },
      });
    }

    const memory = await cofounderService.createMemory(tenantId, text, tags);

    return res.json({
      success: true,
      data: memory,
    });
  } catch (error) {
    logger.error("Create memory error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

