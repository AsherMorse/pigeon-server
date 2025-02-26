import { eq, or, and, gt, sql } from 'drizzle-orm';

import { db } from '@config/database';

import { refreshTokens, users } from '@db/schema';

import type { RegisterDTO } from '@auth';

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
    },
  ) => {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: userData.hashedPassword,
        isVerified: true,
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

  incrementTokenVersion: async (userId: string) => {
    return await db
      .update(users)
      .set({
        tokenVersion: sql`${users.tokenVersion} + 1`,
      })
      .where(eq(users.id, userId))
      .returning();
  },

  storeRefreshToken: async (userId: string, token: string, expiresAt: Date) => {
    const existingToken = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, token),
    });

    if (existingToken) {
      await db
        .update(refreshTokens)
        .set({ isValid: false })
        .where(eq(refreshTokens.token, token));
    }

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
        gt(refreshTokens.expiresAt, new Date()),
      ),
    });
  },

  updateVerification: async (userId: string) => {
    await db
      .update(users)
      .set({
        isVerified: true,
      })
      .where(eq(users.id, userId));
  },

  updatePassword: async (userId: string, hashedPassword: string) => {
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, userId));
  },
};
