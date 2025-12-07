import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import * as authService from "./service.js";
import { logger } from "../../utils/logger.js";

export async function register(req: AuthRequest, res: Response) {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Email and password required", code: "BAD_REQUEST" },
      });
    }

    const result = await authService.register(email, password, name);
    
    return res.json({
      success: true,
      data: {
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
        tenant: { id: result.tenant.id, name: result.tenant.name, slug: result.tenant.slug },
        token: result.token,
      },
    });
  } catch (error) {
    logger.error("Registration error", error as Error);
    return res.status(400).json({
      success: false,
      error: { message: (error as Error).message, code: "BAD_REQUEST" },
    });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Email and password required", code: "BAD_REQUEST" },
      });
    }

    const result = await authService.login(email, password);
    
    return res.json({
      success: true,
      data: {
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
        tenant: { id: result.tenant.id, name: result.tenant.name, slug: result.tenant.slug },
        token: result.token,
      },
    });
  } catch (error) {
    logger.error("Login error", error as Error);
    return res.status(401).json({
      success: false,
      error: { message: (error as Error).message, code: "UNAUTHORIZED" },
    });
  }
}

