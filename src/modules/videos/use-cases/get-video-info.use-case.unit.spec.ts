import { Test, TestingModule } from '@nestjs/testing';
import { GetVideoInfoUseCase } from '../use-cases/get-video-info.use-case';
import { VideoService } from '../services/video.service';
import { ValidFields } from '../dto/get-info.controller.dto';

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

describe('GetVideoInfo', () => {
  let getVideoInfoUseCase: GetVideoInfoUseCase;
  let videoService: VideoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [GetVideoInfoUseCase, VideoService],
    }).compile();

    getVideoInfoUseCase = app.get<GetVideoInfoUseCase>(GetVideoInfoUseCase);
    videoService = app.get<VideoService>(VideoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return video infos', async () => {
    const getVideoInfoMock = {
      channel: {
        channel_url: 'channel_url',
        name: 'name',
        photo_url: 'avatar_url',
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

    const getInfoSpy = jest.spyOn(videoService, 'getInfo').mockResolvedValue({
      videoDetails: {
        title: 'title',
        author: {
          channel_url: 'channel_url',
          name: 'name',
          avatar: 'avatar_url',
        },
        thumbnails: [
          {
            height: 1080,
            width: 1920,
            url: 'url',
          },
        ],
      },
    } as any);

    const getFormatsSpy = jest
      .spyOn(videoService, 'getFormats')
      .mockResolvedValue([
        {
          hasAudio: true,
          hasVideo: true,
          qualityLabel: '720p',
          quality: 'medium',
          url: 'url',
          mimeType: 'video/mp4; codcs',
        },
      ] as any);

    expect(
      await getVideoInfoUseCase.execute({
        fields: [
          ValidFields.TITLE,
          ValidFields.CHANNEL,
          ValidFields.THUMBNAIL,
          ValidFields.FORMATS,
        ],
        url: 'url',
      }),
    ).toStrictEqual(getVideoInfoMock);

    expect(getInfoSpy).toHaveBeenCalled();
    expect(getInfoSpy).toHaveBeenCalledTimes(1);

    expect(getFormatsSpy).toHaveBeenCalled();
    expect(getFormatsSpy).toHaveBeenCalledTimes(1);
  });
});
