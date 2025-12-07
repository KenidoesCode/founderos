import express from "express";
import { authenticate, requireTenant } from "../../middleware/auth.js";
import * as taskController from "./controller.js";

const router = express.Router();

router.get("/", authenticate, requireTenant, taskController.list);
router.post("/", authenticate, requireTenant, taskController.create);
router.patch("/:id", authenticate, requireTenant, taskController.update);
router.delete("/:id", authenticate, requireTenant, taskController.remove);

export default router;

