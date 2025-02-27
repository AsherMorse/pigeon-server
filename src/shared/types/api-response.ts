export interface ApiSuccessResponse<T = unknown> {
  status: 'success';
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export type ErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: ErrorDetail[];
  meta?: Record<string, unknown>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
