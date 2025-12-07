import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { config } from "../../config/env.js";
import * as genomeService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function generate(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { profile } = req.body;

    if (!tenantId || !profile) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and profile required", code: "BAD_REQUEST" },
      });
    }

    const result = await genomeService.generateGenome(tenantId, profile);

    return res.json({
      success: true,
      data: {
        hash: result.hash,
        pointer: result.pointer,
      },
    });
  } catch (error) {
    logger.error("Generate genome error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId required", code: "BAD_REQUEST" },
      });
    }

    const genome = await genomeService.getGenome(tenantId);

    if (!genome) {
      return res.status(404).json({
        success: false,
        error: { message: "Genome not found", code: "NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      data: genome,
    });
  } catch (error) {
    logger.error("Get genome error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

export async function mint(req: AuthRequest, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.body.tenantId;
    const { genomeHash, mode = "user-signed" } = req.body;

    if (!tenantId || !genomeHash) {
      return res.status(400).json({
        success: false,
        error: { message: "tenantId and genomeHash required", code: "BAD_REQUEST" },
      });
    }

    if (!config.contractAddress) {
      return res.status(400).json({
        success: false,
        error: { message: "Contract address not configured", code: "BAD_REQUEST" },
      });
    }

    const unsignedTx = await genomeService.createUnsignedTx(genomeHash, config.contractAddress);

    if (mode === "relayer" && config.relayerPk) {
      // In production, use a relayer service
      return res.status(501).json({
        success: false,
        error: { message: "Relayer mode not yet implemented", code: "NOT_IMPLEMENTED" },
      });
    }

    return res.json({
      success: true,
      data: {
        unsignedTx,
        mode: "user-signed",
      },
    });
  } catch (error) {
    logger.error("Mint genome error", error as Error);
    return res.status(500).json({
      success: false,
      error: { message: (error as Error).message, code: "INTERNAL_ERROR" },
    });
  }
}

