import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from '../services/video.service';

jest.mock('@distube/ytdl-core', () => {
  return {
    createAgent: jest.fn().mockReturnThis(),
    getInfo: jest.fn().mockResolvedValue({
      formats: [],
    }),
    getBasicInfo: jest.fn().mockResolvedValue({
      videoDetails: {},
    }),
  };
});

describe('GetVideoInfo', () => {
  let videoService: VideoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [VideoService],
    }).compile();

    videoService = app.get<VideoService>(VideoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return formats', async () => {
    expect(await videoService.getFormats('url')).toStrictEqual([]);
  });

  it('should return getInfo', async () => {
    expect(await videoService.getInfo('url')).toStrictEqual({
      videoDetails: {},
    });
  });
});
