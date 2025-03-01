 
import { createSuccessSchema, UserObject } from './coreComponents';

// Example profile data
const PROFILE_EXAMPLE = {
  userId: '12345abc-def6-7890',
  imageUrl: '/uploads/profiles/user_12345abc-def6-7890_profile_1234567890.jpg',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

// Define the profile object schema
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
    // Future fields
    // name: {
    //   type: 'string',
    //   example: 'John Doe',
    //   nullable: true,
    // },
    // bio: {
    //   type: 'string',
    //   example: 'I love chatting with friends!',
    //   nullable: true,
    // },
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

// Export profile component schemas
export const profileComponents = {
  schemas: {
    ProfileObject,

    ProfileSuccess: createSuccessSchema(
      'Profile retrieved successfully',
      {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserObject' },
          profile: { $ref: '#/components/schemas/ProfileObject' },
        },
      },
      {
        user: {
          id: '12345abc-def6-7890',
          username: 'user123',
          email: 'user@example.com',
        },
        profile: PROFILE_EXAMPLE,
      },
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

    ProfileImageDeleteSuccess: createSuccessSchema('Profile image removed successfully'),
  },
};
