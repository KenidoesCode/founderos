import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as analysisController from "./controller.js";

const router = express.Router();

router.post("/run", authenticate, requireTenant, analysisController.analyze);

export default router;
