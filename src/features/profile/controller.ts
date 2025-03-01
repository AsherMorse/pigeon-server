import { Request, Response } from 'express';
import { service, validator } from '@profile';
import { asyncErrorHandler } from '@shared/utils';
import { buildSuccessResponse } from '@shared/utils/response';
import { AppError } from '@shared/middleware/errorHandler';

export const controller = {
  getProfile: asyncErrorHandler(async (req: Request, res: Response) => {
    const result = await service.getProfile(req.user!.id);
    res.json(buildSuccessResponse('Profile retrieved successfully', result));
  }),

  getUserProfile: asyncErrorHandler(async (req: Request, res: Response) => {
    const { userId } = validator.userId.parse(req.params);
    const result = await service.getUserProfile(userId);
    res.json(buildSuccessResponse('Profile retrieved successfully', result));
  }),

  uploadProfileImage: asyncErrorHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'No image file uploaded', undefined, 'FILE_REQUIRED');
    }

    validator.profileImage.parse({
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const result = await service.uploadProfileImage(req.user!.id, req.file);
    res.json(buildSuccessResponse('Profile image uploaded successfully', result));
  }),

  deleteProfileImage: asyncErrorHandler(async (req: Request, res: Response) => {
    await service.deleteProfileImage(req.user!.id);
    res.json(buildSuccessResponse('Profile image deleted successfully'));
  }),
};
