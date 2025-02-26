import { Request, Response } from "express";
import { service, validator } from "@auth";
import { asyncErrorHandler } from "@shared/utils";

export const controller = {
  register: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.register.parse(req.body);
    const result = await service.register(data);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: result,
    });
  }),

  login: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.login.parse(req.body);
    const result = await service.login(data);

    res.json({
      status: "success",
      data: result,
    });
  }),

  logout: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.logout.parse(req.body);
    await service.logout(data);

    res.json({
      status: "success",
      message: "Logout successful",
    });
  }),

  refreshToken: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.refreshToken.parse(req.body);
    const result = await service.refreshToken(data);

    res.json({
      status: "success",
      data: result,
    });
  }),
};
