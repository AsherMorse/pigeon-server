import { Request, Response, NextFunction } from 'express';

export const asyncErrorHandler = (
  routeHandler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      await routeHandler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
};
