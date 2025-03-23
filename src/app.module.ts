import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VideoModule } from './modules/videos/video.module';
import { RedirectModule } from './modules/redirects/redirect.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [AuthModule, VideoModule, RedirectModule, StatusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
