import { Module } from '@nestjs/common';
import { VideoController } from './controllers/video.controller';
import { GetVideoInfoUseCase } from './use-cases/get-video-info.use-case';
import { JwtService } from '@nestjs/jwt';
import { VideoService } from './services/video.service';
import { GetVideoUseCase } from './use-cases/get-video.use-case';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [VideoController],
  providers: [GetVideoInfoUseCase, JwtService, VideoService, GetVideoUseCase],
})
export class VideoModule {}
