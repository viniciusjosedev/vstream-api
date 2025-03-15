import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CreateSimpleTokenUseCase } from './use-cases/create-simple-token.use-case';
import { AuthService } from './services/auth.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [AuthController],
  providers: [CreateSimpleTokenUseCase, AuthService],
})
export class AuthModule {}
