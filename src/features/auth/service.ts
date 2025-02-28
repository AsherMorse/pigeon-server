import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import {
  userRepository,
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
    const existingUser = await userRepository.findByEmailOrUsername(data.email);
    if (existingUser) {
      const field = existingUser.email === data.email ? 'email' : 'username';
      throw new AppError(409, `This ${field} is already registered`, undefined, 'RESOURCE_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      ...data,
      hashedPassword,
    });

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id, user.tokenVersion);

    await userRepository.storeRefreshToken(
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
    const user = await userRepository.findByEmailOrUsername(data.credential);
    if (!user) {
      throw new AppError(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS');
    }

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id, user.tokenVersion);

    await userRepository.storeRefreshToken(
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

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(400, 'Invalid refresh token', undefined, 'INVALID_TOKEN');
    }

    const payload = jwtConfig.verifyRefreshToken(refreshToken);
    if (!payload) {
      return { success: true };
    }

    await userRepository.incrementTokenVersion(payload.userId);

    const result = await userRepository.invalidateRefreshToken(refreshToken);

    if (!result || result.length === 0) {
      return { success: true };
    }

    return { success: true };
  },

  refreshToken: async (data: RefreshTokenDTO) => {
    const { refreshToken } = data;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(400, 'Invalid refresh token', undefined, 'INVALID_TOKEN');
    }

    const payload = jwtConfig.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError(
        401,
        'Invalid or expired refresh token',
        undefined,
        'INVALID_REFRESH_TOKEN',
      );
    }

    const tokenRecord = await userRepository.findValidRefreshToken(refreshToken);
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

    await userRepository.invalidateRefreshToken(refreshToken);

    const updatedUser = await userRepository.incrementTokenVersion(payload.userId);

    const { accessToken, refreshToken: newRefreshToken } = jwtConfig.generateTokens(
      payload.userId,
      updatedUser[0].tokenVersion,
    );

    await userRepository.storeRefreshToken(
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
