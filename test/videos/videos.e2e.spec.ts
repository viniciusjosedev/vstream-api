import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { ResponseInterceptor } from 'src/common/response';

const GET_BASIC_INFO_MOCK = {
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
};

const GET_INFO = {
  formats: [
    {
      hasAudio: true,
      hasVideo: true,
      qualityVideo: '720p',
      qualityAudio: 'medium',
      url: 'url',
      format: 'video/mp4',
    },
  ],
};

jest.mock('@distube/ytdl-core', () => {
  return {
    createAgent: jest.fn().mockReturnThis(),
    getInfo: jest.fn().mockResolvedValue({
      formats: [
        {
          hasAudio: true,
          hasVideo: true,
          qualityLabel: '720p',
          quality: 'medium',
          url: 'url',
          mimeType: 'video/mp4; codcs',
        },
      ],
    }),
    getBasicInfo: jest.fn().mockResolvedValue({
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
    }),
  };
});

describe('VideosRouter (e2e)', () => {
  let app: INestApplication<App>;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();

    access_token = (
      await request(app.getHttpServer()).post('/auth/generate-simple-token')
    ).body.data.access_token;
  });

  describe('/video/info (GET)', () => {
    it('should error if Authorization header is empty', async () => {
      const response = await request(app.getHttpServer())
        .get('/video/info')
        .query({
          url: 'url',
          fields: 'title',
        });

      const { body } = response;

      expect(body).toHaveProperty('message', 'Unauthorized');
      expect(body).toHaveProperty('statusCode', 401);
    });

    it('should error if url query params is empty', async () => {
      const response = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          fields: 'title',
        });

      const { body } = response;

      expect(body).toHaveProperty('error', 'Bad Request');
      expect(body).toHaveProperty('message', ['url should not be empty']);
      expect(body).toHaveProperty('statusCode', 400);
    });

    it('should return based fields', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
      } as any);

      const { body: bodyOnlyTitle } = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          url: 'url',
          fields: 'title',
        });

      const { body: bodyOnlyChannel } = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          url: 'url',
          fields: 'channel',
        });

      const { body: bodyOnlyThumbnail } = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          url: 'url',
          fields: 'thumbnail',
        });

      const { body: bodyOnlyFormats } = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          url: 'url',
          fields: 'formats',
        });

      const { body: bodyAllFields } = await request(app.getHttpServer())
        .get('/video/info')
        .set('Authorization', `Bearer ${access_token}`)
        .query({
          url: 'url',
          fields: 'title,channel,thumbnail,formats',
        });

      expect(bodyOnlyTitle).toHaveProperty('success', true);
      expect(bodyOnlyTitle).toHaveProperty('statusCode', 200);
      expect(bodyOnlyTitle).toHaveProperty(['data', 'title'], 'title');

      expect(bodyOnlyChannel).toHaveProperty('success', true);
      expect(bodyOnlyChannel).toHaveProperty('statusCode', 200);
      expect(bodyOnlyChannel).toHaveProperty(['data', 'channel'], {
        channel_url: GET_BASIC_INFO_MOCK.videoDetails.author.channel_url,
        name: GET_BASIC_INFO_MOCK.videoDetails.author.name,
        photo_url: GET_BASIC_INFO_MOCK.videoDetails.author.avatar,
      });

      expect(bodyOnlyThumbnail).toHaveProperty('success', true);
      expect(bodyOnlyThumbnail).toHaveProperty('statusCode', 200);
      expect(bodyOnlyThumbnail).toHaveProperty(['data', 'thumbnail'], {
        ...GET_BASIC_INFO_MOCK.videoDetails.thumbnails[0],
      });

      expect(bodyOnlyFormats).toHaveProperty('success', true);
      expect(bodyOnlyFormats).toHaveProperty('statusCode', 200);
      expect(bodyOnlyFormats).toHaveProperty(
        ['data', 'formats'],
        GET_INFO.formats,
      );
      expect(bodyAllFields).toHaveProperty('success', true);
      expect(bodyAllFields).toHaveProperty('statusCode', 200);
      expect(bodyOnlyTitle).toHaveProperty(['data', 'title'], 'title');
      expect(bodyOnlyChannel).toHaveProperty(['data', 'channel'], {
        channel_url: GET_BASIC_INFO_MOCK.videoDetails.author.channel_url,
        name: GET_BASIC_INFO_MOCK.videoDetails.author.name,
        photo_url: GET_BASIC_INFO_MOCK.videoDetails.author.avatar,
      });
      expect(bodyOnlyThumbnail).toHaveProperty(['data', 'thumbnail'], {
        ...GET_BASIC_INFO_MOCK.videoDetails.thumbnails[0],
      });
      expect(bodyOnlyFormats).toHaveProperty(
        ['data', 'formats'],
        GET_INFO.formats,
      );

      fetchSpy.mockClear();
    });
  });

  describe('/video/download (POST)', () => {
    it('should error if Authorization header is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/video/download')
        .send({
          urlVideo: 'url',
        });

      const { body } = response;

      expect(body).toHaveProperty('message', 'Unauthorized');
      expect(body).toHaveProperty('statusCode', 401);
    });

    it('should error if url body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/video/download')
        .set('Authorization', `Bearer ${access_token}`);

      const { body } = response;

      expect(body).toHaveProperty('error', 'Bad Request');
      expect(body).toHaveProperty('message', [
        'One of the fields urlVideo or urlAudio must be provided',
        'One of the fields urlVideo or urlAudio must be provided',
      ]);
      expect(body).toHaveProperty('statusCode', 400);
    });

    it('should return file', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        body: new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            const chunk = encoder.encode('Simulando um corpo de resposta');
            controller.enqueue(chunk);
            controller.close();
          },
        }),
        headers: {
          get: (param) => {
            if (param === 'Content-Length') {
              return '12312';
            }
          },
        },
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as any);

      const response = await request(app.getHttpServer())
        .post('/video/download')
        .send({
          urlVideo: 'url',
        })
        .set('Authorization', `Bearer ${access_token}`);

      const { status } = response;

      expect(status).toBe(200);

      expect(fetchSpy).toHaveBeenCalled();
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockClear();
    });
  });
});
