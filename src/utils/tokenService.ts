import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenConfig } from "../config/tokenConfig";

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
}

export class TokenService implements ITokenService {
  generateAccessToken(payload: object): string {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured");

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TokenConfig.ACCESS_EXPIRY,
    });
  }

  generateRefreshToken(payload: object): string {
    if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not configured");

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: TokenConfig.REFRESH_EXPIRY,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    } catch {
      return null;
    }
  }
}
