import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as genomeController from "./controller.js";

const router = express.Router();

router.post("/generate", authenticate, requireTenant, genomeController.generate);
router.get("/", authenticate, requireTenant, genomeController.get);
router.post("/mint", authenticate, requireTenant, genomeController.mint);

export default router;

