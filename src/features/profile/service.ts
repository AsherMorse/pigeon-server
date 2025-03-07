import { eq } from 'drizzle-orm';
import { db } from '@db';
import { AppError } from '@shared/middleware/errorHandler';
import { profiles } from '@db/schema';
import { repository } from './repository';
import type { UploadedFile, ProfileDTO } from './types';

const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';

const formatProfileResponse = (profile: any): ProfileDTO => {
  const { imagePath, ...rest } = profile;
  return {
    ...rest,
    imageUrl: profile.imageUrl ? `${HOST_URL}${profile.imageUrl}` : null,
  };
};

export const service = {
  getProfileByUserId: async (userId: string) => {
    const profile = await repository.findByUserId(userId);
    if (!profile) {
      throw new AppError(404, 'Profile not found', undefined, 'RESOURCE_NOT_FOUND');
    }
    return formatProfileResponse(profile);
  },

  uploadProfileImage: async (userId: string, file: UploadedFile) => {
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (existingProfile?.imagePath) {
      await repository.deleteImageFile(existingProfile.imagePath);
    }

    const profile = await repository.upsertProfile(userId, {
      imagePath: file.path,
      imageUrl: `/uploads/profiles/${file.filename}`,
    });

    return {
      imageUrl: `${HOST_URL}${profile.imageUrl}`,
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
    await repository.delete(userId);

    return { success: true };
  },
};
