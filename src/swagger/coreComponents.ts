export interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  allOf?: OpenAPISchema[];
  $ref?: string;
  example?: unknown;
  enum?: string[];
  description?: string;
  nullable?: boolean;
  required?: string[];
}

export interface SchemaProperty {
  properties: Record<string, OpenAPISchema>;
  example: Record<string, unknown>;
}

export interface SuccessSchemaStructure {
  allOf: [{ $ref: string }, SchemaProperty];
}

export const createSuccessSchema = (
  messageSample: string,
  dataSchema: OpenAPISchema | null = null,
  dataSample: Record<string, unknown> | null = null,
): SuccessSchemaStructure => {
  const baseProperties: Record<string, OpenAPISchema> = {
    message: {
      example: messageSample,
    },
  };

  const baseExample: Record<string, unknown> = {
    status: 'success',
    message: messageSample,
  };

  if (dataSchema) {
    baseProperties.data = dataSchema;

    if (dataSample) {
      baseExample.data = dataSample;
    }
  }

  return {
    allOf: [
      { $ref: '#/components/schemas/ApiSuccessResponse' },
      {
        properties: baseProperties,
        example: baseExample,
      },
    ],
  };
};

export interface ErrorValue {
  status: string;
  message: string;
  code: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

export interface ErrorExample {
  value: ErrorValue;
}

export const createErrorResponse = (
  description: string,
  codeExample: string,
  examples: Record<string, ErrorExample> = {},
) => ({
  description,
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/ApiErrorResponse' },
          {
            properties: {
              code: {
                example: codeExample,
              },
            },
          },
        ],
      },
      examples,
    },
  },
});

export const UserObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '12345abc-def6-7890',
    },
    username: {
      type: 'string',
      example: 'user123',
    },
    email: {
      type: 'string',
      example: 'user@example.com',
    },
  },
};

export const coreComponents = {
  schemas: {
    ApiSuccessResponse: {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: {
          type: 'string',
          enum: ['success'],
          example: 'success',
          description: 'Indicates a successful response',
        },
        message: {
          type: 'string',
          description: 'Human-readable success message',
          example: 'Operation completed successfully',
        },
        data: {
          type: 'object',
          description: 'Response payload data',
          nullable: true,
        },
        meta: {
          type: 'object',
          description: 'Metadata like pagination info',
          nullable: true,
        },
      },
      example: {
        status: 'success',
        message: 'Operation completed successfully',
      },
    },
    ApiErrorResponse: {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: {
          type: 'string',
          enum: ['error'],
          example: 'error',
          description: 'Indicates an error response',
        },
        message: {
          type: 'string',
          description: 'Human-readable error message',
          example: 'Operation failed',
        },
        code: {
          type: 'string',
          description: 'Machine-readable error code',
          example: 'VALIDATION_ERROR',
          nullable: true,
        },
        errors: {
          type: 'array',
          description: 'Detailed error information, especially for validation errors',
          nullable: true,
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
                description: 'Field with error',
                example: 'email',
                nullable: true,
              },
              message: {
                type: 'string',
                description: 'Specific error message',
                example: 'Email is invalid',
              },
              code: {
                type: 'string',
                description: 'Error code for this specific error',
                example: 'invalid_email',
                nullable: true,
              },
            },
          },
        },
        meta: {
          type: 'object',
          description: 'Additional error metadata',
          nullable: true,
        },
      },
      example: {
        status: 'error',
        message: 'Operation failed',
        code: 'ERROR_CODE',
      },
    },
    UserObject,
  },

  responses: {
    ValidationError: createErrorResponse('Validation Error', 'VALIDATION_ERROR', {
      'Email Validation': {
        value: {
          status: 'error',
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          errors: [
            {
              field: 'email',
              message: 'Invalid email format',
              code: 'invalid_email',
            },
          ],
        },
      },
      'Username Validation': {
        value: {
          status: 'error',
          message: 'Username can only contain letters and numbers',
          code: 'VALIDATION_ERROR',
          errors: [
            {
              field: 'username',
              message: 'Username can only contain letters and numbers',
              code: 'invalid_string',
            },
          ],
        },
      },
      'Password Validation': {
        value: {
          status: 'error',
          message: 'Password must be at least 8 characters',
          code: 'VALIDATION_ERROR',
          errors: [
            {
              field: 'password',
              message: 'Password must be at least 8 characters',
              code: 'too_small',
            },
          ],
        },
      },
    }),

    UnauthorizedError: createErrorResponse('Unauthorized', 'UNAUTHORIZED', {
      'No Token': {
        value: {
          status: 'error',
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      },
      'Invalid Token': {
        value: {
          status: 'error',
          message: 'Token invalidated',
          code: 'INVALID_TOKEN',
        },
      },
      'Expired Token': {
        value: {
          status: 'error',
          message: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        },
      },
      'Invalid Credentials': {
        value: {
          status: 'error',
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      },
    }),

    InternalServerError: createErrorResponse('Internal Server Error', 'INTERNAL_ERROR', {
      'Server Error': {
        value: {
          status: 'error',
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
    }),

    ResourceExistsError: createErrorResponse('Resource already exists', 'RESOURCE_EXISTS', {
      'Email Exists': {
        value: {
          status: 'error',
          message: 'This email is already registered',
          code: 'RESOURCE_EXISTS',
        },
      },
      'Username Exists': {
        value: {
          status: 'error',
          message: 'This username is already registered',
          code: 'RESOURCE_EXISTS',
        },
      },
    }),

    InvalidTokenError: createErrorResponse('Invalid Token', 'INVALID_TOKEN', {
      'Invalid Token': {
        value: {
          status: 'error',
          message: 'Invalid refresh token',
          code: 'INVALID_TOKEN',
        },
      },
    }),

    NotFoundError: createErrorResponse('Resource not found', 'RESOURCE_NOT_FOUND', {
      'Resource Not Found': {
        value: {
          status: 'error',
          message: 'The requested resource was not found',
          code: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  },
}; 