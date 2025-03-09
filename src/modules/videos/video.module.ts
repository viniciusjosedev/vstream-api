import { Module } from '@nestjs/common';
import { VideoController } from './controllers/video.controller';
import { GetVideoInfo } from './use-cases/get-video-info.use-case';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [VideoController],
  providers: [GetVideoInfo, JwtService],
})
export class VideoModule {}
