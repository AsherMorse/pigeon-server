import fs from 'fs/promises';
import { eq } from 'drizzle-orm';
import { db } from '@db';
import { profiles } from '@db/schema';

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
