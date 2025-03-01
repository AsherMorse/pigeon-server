import fs from 'fs/promises';
import { eq } from 'drizzle-orm';
import { db } from '@db';
import { AppError } from '@shared/middleware/errorHandler';
import { profiles } from '@db/schema';
import type { CreateProfileDTO, UpdateProfileDTO } from './types';

export const repository = {
  findByUserId: async (userId: string) => {
    return await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      columns: {
        userId: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  create: async (profileData: CreateProfileDTO) => {
    try {
      const [profile] = await db.insert(profiles).values(profileData).returning({
        userId: profiles.userId,
        imageUrl: profiles.imageUrl,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      });
      return profile;
    } catch (error) {
      const pgError = error as { code?: string; constraint?: string };

      if (pgError.code === '23505' && pgError.constraint === 'profiles_user_id_unique') {
        throw new AppError(
          409,
          'Profile already exists for this user',
          undefined,
          'RESOURCE_EXISTS',
        );
      }

      throw error;
    }
  },

  update: async (userId: string, profileData: UpdateProfileDTO) => {
    const [profile] = await db
      .update(profiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning({
        userId: profiles.userId,
        imageUrl: profiles.imageUrl,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      });
    return profile;
  },

  delete: async (userId: string) => {
    const [profile] = await db.delete(profiles).where(eq(profiles.userId, userId)).returning();
    return profile;
  },

  upsertProfile: async (userId: string, data: { imagePath: string; imageUrl: string }) => {
    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          imageUrl: data.imageUrl,
          imagePath: data.imagePath,
          updatedAt: new Date(),
        },
      })
      .returning();
    return profile;
  },

  updateProfile: async (
    userId: string,
    data: { imagePath: string | null; imageUrl: string | null },
  ) => {
    const [profile] = await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  },

  deleteImageFile: async (imagePath: string) => {
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      // Ignore errors if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  },
};
