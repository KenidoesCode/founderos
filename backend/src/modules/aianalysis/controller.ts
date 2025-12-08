import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { runAnalysis } from "./service.js";

export async function analyze(req: AuthRequest, res: Response) {
  try {
    const { idea } = req.body;

    if (!idea || idea.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Startup idea is required",
          code: "BAD_REQUEST"
        }
      });
    }

    const result = await runAnalysis(idea);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: (error as Error).message,
        code: "INTERNAL_ERROR",
      }
    });
  }
}
