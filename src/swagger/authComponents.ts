/* eslint-disable max-lines */
import {
  createSuccessSchema,
} from './coreComponents';

const TOKEN_EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const USER_EXAMPLE = {
  id: '12345abc-def6-7890',
  username: 'user123',
  email: 'user@example.com',
};

const authTokenUserSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example: TOKEN_EXAMPLE,
    },
    refreshToken: {
      type: 'string',
      example: TOKEN_EXAMPLE,
    },
    user: {
      $ref: '#/components/schemas/UserObject',
    },
  },
};

export const authComponents = {
  schemas: {
    TokenPair: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: TOKEN_EXAMPLE,
        },
        refreshToken: {
          type: 'string',
          example: TOKEN_EXAMPLE,
        },
      },
    },

    RegistrationSuccess: createSuccessSchema('Registration successful', authTokenUserSchema, {
      accessToken: TOKEN_EXAMPLE,
      refreshToken: TOKEN_EXAMPLE,
      user: USER_EXAMPLE,
    }),
    LoginSuccess: createSuccessSchema('Login successful', authTokenUserSchema, {
      accessToken: TOKEN_EXAMPLE,
      refreshToken: TOKEN_EXAMPLE,
      user: USER_EXAMPLE,
    }),
    LogoutSuccess: createSuccessSchema('Logout successful'),
    RefreshTokenSuccess: createSuccessSchema(
      'Refresh token successful',
      {
        allOf: [{ $ref: '#/components/schemas/TokenPair' }],
      },
      {
        accessToken: TOKEN_EXAMPLE,
        refreshToken: TOKEN_EXAMPLE,
      },
    ),
    SessionSuccess: createSuccessSchema(
      'Session is valid',
      { $ref: '#/components/schemas/UserObject' },
      USER_EXAMPLE,
    ),
  },
}; 