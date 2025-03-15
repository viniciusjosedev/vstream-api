import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { GetVideoInfoUseCase } from '../use-cases/get-video-info.use-case';
import { JwtService } from '@nestjs/jwt';
import { ValidFields } from '../dto/get-info.controller.dto';
import { VideoService } from '../services/video.service';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';

jest.mock('@nestjs/jwt', () => {
  const actual = jest.requireActual('@nestjs/jwt');

  return {
    ...actual,
    JwtService: jest.fn().mockImplementation(() => {
      return {
        sign: jest.fn().mockReturnValue('token'),
      };
    }),
  };
});

describe('VideoController', () => {
  let videoController: VideoController;
  let getVideoInfoUseCase: GetVideoInfoUseCase;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [VideoController],
      providers: [
        GetVideoInfoUseCase,
        GetVideoUseCase,
        JwtService,
        VideoService,
      ],
    }).compile();

    videoController = app.get<VideoController>(VideoController);
    getVideoInfoUseCase = app.get<GetVideoInfoUseCase>(GetVideoInfoUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return video infos', async () => {
    const getVideoInfoMock = {
      channel: {
        channel_url: 'url',
        name: 'name',
        photo_url: 'url',
      },
      formats: [
        {
          format: 'video/mp4',
          hasAudio: true,
          hasVideo: true,
          qualityAudio: 'medium',
          qualityVideo: '720p',
          url: 'url',
        },
      ],
      thumbnail: {
        height: 1080,
        width: 1920,
        url: 'url',
      },
      title: 'title',
    };

    const getVideoInfoUseCaseSpy = jest
      .spyOn(getVideoInfoUseCase, 'execute')
      .mockResolvedValue(getVideoInfoMock);

    expect(
      await videoController.getInfo({
        fields: [
          ValidFields.TITLE,
          ValidFields.CHANNEL,
          ValidFields.THUMBNAIL,
          ValidFields.FORMATS,
        ],
        url: 'url',
      }),
    ).toStrictEqual(getVideoInfoMock);

    expect(getVideoInfoUseCaseSpy).toHaveBeenCalled();
    expect(getVideoInfoUseCaseSpy).toHaveBeenCalledTimes(1);
  });
});
