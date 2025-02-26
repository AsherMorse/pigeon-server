import jwt from 'jsonwebtoken';
import 'dotenv/config';
import crypto from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const jwtConfig = {
  generateTokens: (userId: string, tokenVersion: number = 0) => {
    const jti = crypto.randomBytes(16).toString('hex');

    const accessToken = jwt.sign({ userId, tokenVersion, jti }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId, tokenVersion, jti }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  },

  verifyAccessToken: (token: string) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; tokenVersion?: number; jti?: string };
    } catch {
      return null;
    }
  },

  verifyRefreshToken: (token: string) => {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; tokenVersion?: number; jti?: string };
    } catch {
      return null;
    }
  },
};
