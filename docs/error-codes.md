# API Error Codes

This document lists all error codes used in the Pigeon API. Consistent error
codes help clients handle errors more effectively.

## General Error Codes

| Code                 | HTTP Status | Description                                      |
| -------------------- | ----------- | ------------------------------------------------ |
| `INTERNAL_ERROR`     | 500         | Unexpected server error                          |
| `VALIDATION_ERROR`   | 400         | Request validation failed                        |
| `UNAUTHORIZED`       | 401         | Authentication required or token invalid         |
| `FORBIDDEN`          | 403         | Authenticated but not authorized for this action |
| `NOT_FOUND`          | 404         | Resource not found                               |
| `METHOD_NOT_ALLOWED` | 405         | HTTP method not allowed for this endpoint        |
| `CONFLICT`           | 409         | Resource conflict (e.g., already exists)         |
| `TOO_MANY_REQUESTS`  | 429         | Rate limit exceeded                              |

## Authentication Errors

| Code                    | HTTP Status | Description                               |
| ----------------------- | ----------- | ----------------------------------------- |
| `INVALID_CREDENTIALS`   | 401         | Username/email or password is incorrect   |
| `INVALID_TOKEN`         | 401         | Token is malformed or invalid             |
| `EXPIRED_TOKEN`         | 401         | Token has expired                         |
| `INVALID_REFRESH_TOKEN` | 401         | Refresh token is invalid or expired       |
| `TOKEN_INVALIDATED`     | 401         | Token was invalidated (e.g., by logout)   |
| `ACCOUNT_LOCKED`        | 401         | User account is locked                    |
| `RESOURCE_EXISTS`       | 409         | Resource (username, email) already exists |

## Validation Error Codes

These codes appear in the `errors[].code` field for validation errors:

| Code             | Description                                |
| ---------------- | ------------------------------------------ |
| `required`       | Required field is missing                  |
| `invalid_type`   | Field has wrong type                       |
| `too_small`      | String/array too short or number too small |
| `too_big`        | String/array too long or number too large  |
| `invalid_email`  | Email format is invalid                    |
| `invalid_string` | String format doesn't match pattern        |

## Using Error Codes in Clients

Error responses follow this format:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field error message",
      "code": "error_code"
    }
  ]
}
```

Client code should handle errors based on the `code` field rather than the
message, as messages may change but codes remain constant.
