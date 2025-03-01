import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import {
  repository,
  type RegisterDTO,
  type LoginDTO,
  type LogoutDTO,
  type RefreshTokenDTO,
} from '@auth';
import { db } from '@db';
import { jwtConfig } from '@config/jwt';
import { AppError } from '@shared/middleware/errorHandler';
import { users } from '@db/schema';

export const service = {
  register: async (data: RegisterDTO) => {
    const existingEmail = await repository.findByEmailOrUsername(data.email);
    if (existingEmail) {
      throw new AppError(409, 'This email is already registered', undefined, 'RESOURCE_EXISTS');
    }

    const existingUsername = await repository.findByEmailOrUsername(data.username);
    if (existingUsername) {
      throw new AppError(409, 'This username is already registered', undefined, 'RESOURCE_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await repository.create({
      ...data,
      hashedPassword,
    });

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id, user.tokenVersion);

    await repository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  },

  login: async (data: LoginDTO) => {
    const user = await repository.findByEmailOrUsername(data.credential);
    if (!user) {
      throw new AppError(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS');
    }

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id, user.tokenVersion);

    await repository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  },

  logout: async (data: LogoutDTO) => {
    const { refreshToken } = data;
    const payload = jwtConfig.verifyRefreshToken(refreshToken);
    if (!payload) {
      return { success: true };
    }

    await repository.incrementTokenVersion(payload.userId);
    const result = await repository.invalidateRefreshToken(refreshToken);

    if (!result || result.length === 0) {
      return { success: true };
    }

    return { success: true };
  },

  refreshToken: async (data: RefreshTokenDTO) => {
    const { refreshToken } = data;
    const payload = jwtConfig.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError(
        401,
        'Invalid or expired refresh token',
        undefined,
        'INVALID_REFRESH_TOKEN',
      );
    }

    const tokenRecord = await repository.findValidRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new AppError(
        401,
        'Invalid or expired refresh token',
        undefined,
        'INVALID_REFRESH_TOKEN',
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new AppError(
        401,
        'Invalid or expired refresh token',
        undefined,
        'INVALID_REFRESH_TOKEN',
      );
    }

    await repository.invalidateRefreshToken(refreshToken);
    const updatedUser = await repository.incrementTokenVersion(payload.userId);

    const { accessToken, refreshToken: newRefreshToken } = jwtConfig.generateTokens(
      payload.userId,
      updatedUser[0].tokenVersion,
    );

    await repository.storeRefreshToken(
      payload.userId,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },
};
