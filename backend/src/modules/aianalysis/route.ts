import { Router, Request, Response } from "express";
import { runCompetitiveAnalysis } from "./aianalysis.js";

const router = Router();

/**
 * POST /api/aianalysis/run
 */
router.post("/run", async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;

    if (!idea || idea.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid startup idea.",
      });
    }

    const result = await runCompetitiveAnalysis(idea);

    return res.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
