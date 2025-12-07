import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as timewarpController from "./controller.js";

const router = express.Router();

router.get("/next", authenticate, requireTenant, timewarpController.getNext);

export default router;

