import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { message: "Missing or invalid authorization header", code: "UNAUTHORIZED" },
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Invalid or expired token", code: "UNAUTHORIZED" },
    });
  }
}

export function requireTenant(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.tenantId) {
    return res.status(403).json({
      success: false,
      error: { message: "Tenant ID required", code: "FORBIDDEN" },
    });
  }
  next();
}

