import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CreateSimpleTokenService } from './use-cases/create-simple-token.use-case';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [CreateSimpleTokenService, AuthService],
})
export class AuthModule {}
