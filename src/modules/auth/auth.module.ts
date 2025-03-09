import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CreateSimpleTokenService } from './use-cases/create-simple-token.use-case';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [CreateSimpleTokenService],
})
export class AuthModule {}
