import { Controller, Post } from '@nestjs/common';
import { CreateSimpleTokenUseCase } from '../use-cases/create-simple-token.use-case';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createSimpleTokenUseCase: CreateSimpleTokenUseCase,
  ) {}

  @Post('generate-simple-token')
  @ApiResponse({
    status: 201,
    description: 'Token generated successfully',
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'sample_token_here',
        },
        statusCode: 201,
      },
    },
  })
  generateSimpleToken(): { access_token: string } {
    return {
      access_token: this.createSimpleTokenUseCase.execute(),
    };
  }
}
