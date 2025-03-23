import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/videos/video.module';
import { RedirectModule } from './modules/redirects/redirect.module';

@Module({
  imports: [AuthModule, VideoModule, RedirectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
