import { Request, Response } from 'express';
import { service, validator } from '@auth';
import { asyncErrorHandler } from '@shared/utils';
import { buildSuccessResponse } from '@shared/utils/response';

export const controller = {
  register: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.register.parse(req.body);
    const result = await service.register(data);

    res.status(201).json(buildSuccessResponse('Registration successful', result));
  }),

  login: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.login.parse(req.body);
    const result = await service.login(data);

    res.json(buildSuccessResponse('Login successful', result));
  }),

  logout: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.logout.parse(req.body);
    await service.logout(data);

    res.json(buildSuccessResponse('Logout successful'));
  }),

  refreshToken: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = validator.refreshToken.parse(req.body);
    const result = await service.refreshToken(data);

    res.json(buildSuccessResponse('Refresh token successful', result));
  }),

  session: asyncErrorHandler(async (req: Request, res: Response) => {
    res.json(buildSuccessResponse('Session is valid', req.user));
  }),
};
