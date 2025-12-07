import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

// Routes
import authRoutes from "./modules/auth/routes.js";
import cofounderRoutes from "./modules/cofounder/routes.js";
import genomeRoutes from "./modules/genome/routes.js";
import startupRoutes from "./modules/startup/routes.js";
import timewarpRoutes from "./modules/timewarp/routes.js";
import taskRoutes from "./modules/tasks/routes.js";

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cofounder", cofounderRoutes);
app.use("/api/genome", genomeRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/timewarp", timewarpRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error", err, {
    route: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
      code: "INTERNAL_ERROR",
    },
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`FounderOS backend running on port ${PORT}`);
});

