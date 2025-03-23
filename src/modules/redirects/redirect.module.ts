import { Module } from '@nestjs/common';
import { RedirectController } from './controllers/redirect.controller';

@Module({
  imports: [],
  controllers: [RedirectController],
  providers: [],
})
export class RedirectModule {}
