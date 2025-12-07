import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as cofounderController from "./controller.js";

const router = express.Router();

router.post("/ask", authenticate, requireTenant, cofounderController.ask);
router.get("/memories", authenticate, requireTenant, cofounderController.getMemories);
router.post("/memory", authenticate, requireTenant, cofounderController.createMemory);

export default router;

