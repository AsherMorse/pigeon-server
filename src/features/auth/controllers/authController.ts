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
};
