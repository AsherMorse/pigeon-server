import { ApiSuccessResponse, ApiErrorResponse, ErrorDetail } from '@shared/types/api-response';
import { AppError } from '@shared/middleware/errorHandler';

export const buildSuccessResponse = <T = unknown>(
  message: string,
  data?: T,
  meta?: Record<string, unknown>,
): ApiSuccessResponse<T> => {
  const response: ApiSuccessResponse<T> = {
    status: 'success',
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta && Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

export const buildErrorResponse = (
  message: string,
  code?: string,
  errors?: ErrorDetail[],
): ApiErrorResponse => {
  const response: ApiErrorResponse = {
    status: 'error',
    message,
  };

  if (code) {
    response.code = code;
  }

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return response;
};

export const createValidationError = (
  message: string,
  field: string,
  errorCode: string = 'invalid_value',
  statusCode: number = 400,
  customCode: string = 'VALIDATION_ERROR'
): AppError => {
  return new AppError(
    statusCode,
    message,
    [{
      field,
      message,
      code: errorCode
    }],
    customCode
  );
};
