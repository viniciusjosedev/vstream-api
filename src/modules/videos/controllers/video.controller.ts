import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetInfoDTO } from '../dto/get-info.controller.dto';
import { AuthMiddleware } from 'src/modules/auth/middlewares/auth.middleware';
import { GetVideoInfo } from '../use-cases/get-video-info.use-case';

@Controller('/video')
@UseGuards(AuthMiddleware)
export class VideoController {
  constructor(private readonly getVideoInfo: GetVideoInfo) {}

  @Get('/info')
  public getInfo(
    @Query(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
      }),
    )
    query: GetInfoDTO,
  ) {
    return this.getVideoInfo.execute(query);
  }
}
