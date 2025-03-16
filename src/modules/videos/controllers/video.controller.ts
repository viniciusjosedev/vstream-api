import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/auth-doc.decorator';

@ApiTags('Video')
@Controller('/video')
@UseGuards(AuthMiddleware)
export class VideoController {
  constructor(
    private readonly getVideoInfoUseCase: GetVideoInfoUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
  ) {}

  @Get('/info')
  @ApiAuth()
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          title: 'Example Video',
          channel: {
            name: 'name',
            photo_url: 'photo_url',
            channel_url: 'channel_url',
          },
          thumbnail: {
            url: 'url',
            width: 1920,
            height: 1080,
          },
          formats: [
            {
              hasVideo: true,
              hasAudio: true,
              qualityVideo: '720p',
              qualityAudio: 'medium',
              format: 'video/mp4',
              url: 'url',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      },
    },
  })
  @HttpCode(200)
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
  @ApiAuth()
  @ApiResponse({
    status: 200,
    description: 'Successful response, returns data as a chunked Buffer',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(200)
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
