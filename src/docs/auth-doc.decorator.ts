import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Token is missing or invalid',
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
          success: false,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          message: 'Internal server error',
          statusCode: 500,
          success: false,
        },
      },
    }),
  );
}
