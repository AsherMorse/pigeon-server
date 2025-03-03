import { createSuccessSchema } from './coreComponents';

const PROFILE_EXAMPLE = {
  id: '04868b58-f5b8-46d6-afd1-2dfd4395f464',
  userId: '12345abc-def6-7890',
  imageUrl: 'https://api.example.com/uploads/profiles/user_12345abc-def6-7890_profile_1234567890.png',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const ProfileObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: PROFILE_EXAMPLE.id,
    },
    userId: {
      type: 'string',
      format: 'uuid',
      example: PROFILE_EXAMPLE.userId,
    },
    imageUrl: {
      type: 'string',
      format: 'uri',
      example: PROFILE_EXAMPLE.imageUrl,
      description: 'Full URL to the profile image',
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
            description: 'Full URL to the uploaded profile image',
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
