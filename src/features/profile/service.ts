import { eq } from 'drizzle-orm';
import { db } from '@db';
import { AppError } from '@shared/middleware/errorHandler';
import { profiles } from '@db/schema';
import { repository } from './repository';
import type { UploadedFile } from './types';

export const service = {
  getProfile: async (userId: string) => {
    const profile = await repository.findByUserId(userId);
    if (!profile) {
      throw new AppError(404, 'Profile not found', undefined, 'RESOURCE_NOT_FOUND');
    }

    return profile;
  },

  getUserProfile: async (userId: string) => {
    const profile = await repository.findByUserId(userId);
    if (!profile) {
      throw new AppError(404, 'Profile not found', undefined, 'RESOURCE_NOT_FOUND');
    }

    return profile;
  },

  uploadProfileImage: async (userId: string, file: UploadedFile) => {
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (existingProfile?.imagePath) {
      // Delete old image file if it exists
      await repository.deleteImageFile(existingProfile.imagePath);
    }

    const profile = await repository.upsertProfile(userId, {
      imagePath: file.path,
      imageUrl: `/uploads/profiles/${file.filename}`,
    });

    return {
      imageUrl: profile.imageUrl,
    };
  },

  deleteProfileImage: async (userId: string) => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile || !profile.imagePath) {
      throw new AppError(404, 'Profile image not found', undefined, 'RESOURCE_NOT_FOUND');
    }

    await repository.deleteImageFile(profile.imagePath);
    await repository.updateProfile(userId, {
      imagePath: null,
      imageUrl: null,
    });

    return { success: true };
  },
};
