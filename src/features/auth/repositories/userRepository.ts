import { eq, or, and, gt } from "drizzle-orm";
import { db } from "../../../config/database";
import type { RegisterDTO } from "../types/authTypes";
import { refreshTokens, users } from "../../../db/schema";

export const userRepository = {
  findByEmailOrUsername: async (credential: string) => {
    return await db.query.users.findFirst({
      where: or(eq(users.email, credential), eq(users.username, credential)),
    });
  },

  create: async (
    userData: RegisterDTO & {
      hashedPassword: string;
    }
  ) => {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: userData.hashedPassword,
        isVerified: true,
      })
      .returning();
    return user;
  },

  storeRefreshToken: async (userId: number, token: string, expiresAt: Date) => {
    await db.insert(refreshTokens).values({
      userId,
      token,
      expiresAt,
    });
  },

  invalidateRefreshToken: async (token: string) => {
    return await db
      .update(refreshTokens)
      .set({ isValid: false })
      .where(eq(refreshTokens.token, token))
      .returning();
  },

  findValidRefreshToken: async (token: string) => {
    return await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, token),
        eq(refreshTokens.isValid, true),
        gt(refreshTokens.expiresAt, new Date())
      ),
      with: {
        user: true
      }
    });
  },

  updateVerification: async (userId: number) => {
    await db
      .update(users)
      .set({
        isVerified: true,
      })
      .where(eq(users.id, userId));
  },

  updatePassword: async (userId: number, hashedPassword: string) => {
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, userId));
  },
};
