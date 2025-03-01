import { createSuccessSchema } from './coreComponents';

const PROFILE_EXAMPLE = {
  userId: '12345abc-def6-7890',
  imageUrl: '/uploads/profiles/user_12345abc-def6-7890_profile_1234567890.png',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const ProfileObject = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      example: PROFILE_EXAMPLE.userId,
    },
    imageUrl: {
      type: 'string',
      example: PROFILE_EXAMPLE.imageUrl,
      nullable: true,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: PROFILE_EXAMPLE.createdAt,
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: PROFILE_EXAMPLE.updatedAt,
    },
  },
};

export const profileComponents = {
  schemas: {
    ProfileObject,

    ProfileSuccess: createSuccessSchema(
      'Profile retrieved successfully',
      { $ref: '#/components/schemas/ProfileObject' },
      PROFILE_EXAMPLE,
    ),

    ProfileImageSuccess: createSuccessSchema(
      'Profile image uploaded successfully',
      {
        type: 'object',
        properties: {
          imageUrl: {
            type: 'string',
            example: PROFILE_EXAMPLE.imageUrl,
          },
        },
      },
      {
        imageUrl: PROFILE_EXAMPLE.imageUrl,
      },
    ),

    ProfileImageDeleteSuccess: createSuccessSchema(
      'Profile image removed successfully',
      {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
        },
      },
      { success: true },
    ),
  },
};
