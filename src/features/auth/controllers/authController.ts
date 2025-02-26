import { Request, Response } from "express";
import { authService } from "../services/authService";
import { authValidator } from "../validators/authValidator";
import { asyncErrorHandler } from "../../../shared/utils";

export const authController = {
  register: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.register.parse(req.body);
    const result = await authService.register(data);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: result,
    });
  }),

  login: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.login.parse(req.body);
    const result = await authService.login(data);

    res.json({
      status: "success",
      data: result,
    });
  }),

  logout: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.logout.parse(req.body);
    await authService.logout(data);

    res.json({
      status: "success",
      message: "Logout successful",
    });
  }),

  refreshToken: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.refreshToken.parse(req.body);
    const result = await authService.refreshToken(data);

    res.json({
      status: "success",
      data: result,
    });
  }),
};
