import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorDetail } from '@shared/types/api-response';
import { buildErrorResponse } from '@shared/utils/response';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, unknown>[],
    public code: string = `ERROR_${statusCode}`,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

const formatZodError = (error: ZodError): { message: string; errors: ErrorDetail[] } => {
  const firstError = error.errors[0];

  return {
    message: firstError.message,
    errors: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  };
};

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const formattedError = formatZodError(err);
    return res
      .status(400)
      .json(buildErrorResponse(formattedError.message, 'VALIDATION_ERROR', formattedError.errors));
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      buildErrorResponse(
        err.message,
        err.code,
        err.errors?.map(error => ({
          message: String(error.message || ''),
          ...error,
        })) as ErrorDetail[],
      ),
    );
  }

  // For unexpected errors
  return res
    .status(500)
    .json(
      buildErrorResponse(
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        'INTERNAL_ERROR',
      ),
    );
};
