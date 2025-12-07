import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import * as timewarpService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function getNext(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const prediction = await timewarpService.computeTimeWarp(tenantId);

    return res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    logger.error("TimeWarp error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

