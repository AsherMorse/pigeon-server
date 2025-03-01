import { z } from 'zod';

export const validator = {
  userId: z.object({
    userId: z.string().uuid('Invalid user ID format'),
  }),

  profileImage: z.object({
    mimetype: z
      .string()
      .refine(
        type => ['image/jpeg', 'image/png'].includes(type),
        'Invalid file type. Only JPEG and PNG are allowed',
      ),
    size: z.number().max(5 * 1024 * 1024, 'File size exceeds the 5MB limit'),
  }),
};
