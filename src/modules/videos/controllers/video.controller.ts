import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetInfoControllerDTO } from '../dto/get-info.controller.dto';
import { AuthMiddleware } from 'src/modules/auth/middlewares/auth.middleware';
import { GetVideoInfoUseCase } from '../use-cases/get-video-info.use-case';
import { GetVideoControllerDTO } from '../dto/get-video.controller.dto';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';
import { Response } from 'express';

@Controller('/video')
@UseGuards(AuthMiddleware)
export class VideoController {
  constructor(
    private readonly getVideoInfoUseCase: GetVideoInfoUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
  ) {}

  @Get('/info')
  public getInfo(
    @Query(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
      }),
    )
    query: GetInfoControllerDTO,
  ) {
    return this.getVideoInfoUseCase.execute(query);
  }

  @Post('/download')
  public getVideo(
    @Body(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
      }),
    )
    body: GetVideoControllerDTO,
    @Res()
    res: Response,
  ) {
    return this.getVideoUseCase.execute(body.url, res);
  }
}
