import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";
import { prisma } from "../config/db.js";

// Middleware to ensure all queries are scoped to the user's tenant
export async function tenantScope(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.tenantId) {
    return res.status(403).json({
      success: false,
      error: { message: "Tenant ID required", code: "FORBIDDEN" },
    });
  }

  // Attach tenantId to request for easy access
  req.tenantId = req.user.tenantId;
  next();
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

