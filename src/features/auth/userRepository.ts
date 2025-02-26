import { eq, or, and, gt } from "drizzle-orm";
import { db } from "@config/database";
import type { RegisterDTO } from "@auth";
import { refreshTokens, users } from "@db/schema";
import { sql } from "drizzle-orm";

export const userRepository = {
  findByEmailOrUsername: async (credential: string) => {
    return await db.query.users.findFirst({
      where: or(eq(users.email, credential), eq(users.username, credential)),
      columns: {
        id: true,
        username: true,
        email: true,
        password: true,
        isVerified: true,
        tokenVersion: true,
      },
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
        // Default tokenVersion is 0 from schema definition
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        isVerified: users.isVerified,
        tokenVersion: users.tokenVersion,
      });
    return user;
  },

  incrementTokenVersion: async (userId: number) => {
    return await db
      .update(users)
      .set({
        tokenVersion: sql`${users.tokenVersion} + 1`,
      })
      .where(eq(users.id, userId))
      .returning();
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
      )
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
