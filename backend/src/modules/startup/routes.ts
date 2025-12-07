import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as startupController from "./controller.js";

const router = express.Router();

router.post("/generate", authenticate, requireTenant, startupController.generate);
router.get("/list", authenticate, requireTenant, startupController.list);
router.get("/:slug", authenticate, requireTenant, startupController.get);
router.post("/publish", authenticate, requireTenant, startupController.publish);

export default router;

