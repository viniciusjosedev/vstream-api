import { Controller, Post } from '@nestjs/common';
import { CreateSimpleTokenUseCase } from '../use-cases/create-simple-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createSimpleTokenUseCase: CreateSimpleTokenUseCase,
  ) {}

  @Post('generate-simple-token')
  generateSimpleToken(): { access_token: string } {
    return {
      access_token: this.createSimpleTokenUseCase.execute(),
    };
  }
}
