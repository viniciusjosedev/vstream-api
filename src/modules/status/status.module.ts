import { Module } from '@nestjs/common';
import { StatusController } from './controllers/status.controller';

@Module({
  imports: [],
  controllers: [StatusController],
  providers: [],
})
export class StatusModule {}
