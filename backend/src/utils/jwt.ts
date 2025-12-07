import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email?: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

