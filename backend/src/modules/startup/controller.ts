import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import * as startupService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function generate(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { tags, market, skillLevel, budget, geography } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const startup = await startupService.generateStartup(tenantId, {
      tags,
      market,
      skillLevel,
      budget,
      geography,
    });

    return res.json({
      success: true,
      data: startup,
    });
  } catch (error) {
    logger.error("Generate startup error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const startups = await startupService.getStartups(tenantId);

    return res.json({
      success: true,
      data: startups,
    });
  } catch (error) {
    logger.error("List startups error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const slug = req.params.slug;

    if (!tenantId || !slug) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and slug required", code: "BAD_REQUEST" },
      });
    }

    const startup = await startupService.getStartup(tenantId, slug);

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: { message: "Startup not found", code: "NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      data: startup,
    });
  } catch (error) {
    logger.error("Get startup error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function publish(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { slug } = req.body;

    if (!tenantId || !slug) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and slug required", code: "BAD_REQUEST" },
      });
    }

    await startupService.publishStartup(tenantId, slug);

    return res.json({
      success: true,
      data: { message: "Startup published" },
    });
  } catch (error) {
    logger.error("Publish startup error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

