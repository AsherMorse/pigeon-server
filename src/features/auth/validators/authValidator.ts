import { z } from "zod";

export const authValidator = {
  register: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),

  login: z.object({
    credential: z.string(),
    password: z.string(),
  }),

  logout: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  refreshToken: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
};
