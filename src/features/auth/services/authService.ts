import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { jwtConfig } from "../../../config/jwt";
import type {
  RegisterDTO,
  LoginDTO,
  LogoutDTO,
  RefreshTokenDTO,
} from "../types/authTypes";
import { AppError } from "../../../shared/middleware/errorHandler";

export const authService = {
  register: async (data: RegisterDTO) => {
    const existingUser = await userRepository.findByEmailOrUsername(data.email);
    if (existingUser) {
      const field = existingUser.email === data.email ? "email" : "username";
      throw new AppError(409, `This ${field} is already registered`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      ...data,
      hashedPassword,
    });

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id);

    await userRepository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
      throw new AppError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id);

    await userRepository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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

    // Verify that the token format is valid before attempting to invalidate
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(400, "Invalid refresh token");
    }

    // Invalidate the refresh token
    const result = await userRepository.invalidateRefreshToken(refreshToken);

    // If the token wasn't found, it may already be invalid or never existed
    if (!result || result.length === 0) {
      // We don't reveal if the token existed or not to prevent information leakage
      // Just return success
      return { success: true };
    }

    return { success: true };
  },

  refreshToken: async (data: RefreshTokenDTO) => {
    const { refreshToken } = data;

    // Verify that the token format is valid
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(400, "Invalid refresh token");
    }

    // First verify the token using JWT
    const payload = jwtConfig.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    // Then check if the token exists in the database and is still valid
    const tokenRecord = await userRepository.findValidRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    // Invalidate the current refresh token to prevent reuse
    await userRepository.invalidateRefreshToken(refreshToken);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = jwtConfig.generateTokens(payload.userId);

    // Store the new refresh token
    await userRepository.storeRefreshToken(
      payload.userId,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    // Return the new tokens
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },
};
