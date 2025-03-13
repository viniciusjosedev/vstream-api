import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { ResponseInterceptor } from 'src/common/response';

describe('AuthRouter (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  describe('/auth/generate-simple-token (POST)', () => {
    it('should return token', async () => {
      const response = await request(app.getHttpServer()).post(
        '/auth/generate-simple-token',
      );

      const { body } = response;

      expect(body).toHaveProperty(['data', 'access_token']);
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('statusCode', 201);
    });
  });
});
