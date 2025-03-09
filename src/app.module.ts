import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/videos/video.module';

@Module({
  imports: [AuthModule, VideoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
