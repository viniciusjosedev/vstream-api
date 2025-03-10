import { Controller, Post } from '@nestjs/common';
import { CreateSimpleTokenService } from 'src/modules/auth/use-cases/create-simple-token.use-case';

@Controller()
export class AuthController {
  constructor(
    private readonly createSimpleTokenService: CreateSimpleTokenService,
  ) {}

  @Post('generate-simple-token')
  generateSimpleToken(): { access_token: string } {
    return {
      access_token: this.createSimpleTokenService.execute(),
    };
  }
}
