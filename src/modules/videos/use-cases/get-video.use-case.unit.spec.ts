import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { GetVideoUseCase } from './get-video.use-case';

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

describe('GetVideoUseCase', () => {
  let getVideoUseCase: GetVideoUseCase;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [GetVideoUseCase],
    }).compile();

    getVideoUseCase = app.get<GetVideoUseCase>(GetVideoUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should error if response is not ok', () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as any);

    expect(async () => {
      await getVideoUseCase.execute({
        res: {} as Response,
        urlVideo: 'url',
      });
    }).rejects.toThrow('Error in request with urlVideo');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should write chunks in response', async () => {
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
          if (param === 'Content-Length') return '1';
          else return 'video/mp4';
        },
      },
      arrayBuffer: () => new ArrayBuffer(1),
    } as any);

    const res = {
      setHeader: () => {},
      end: () => {},
      on: () => {},
      write: () => {},
      once: () => {},
      emit: () => {},
      status: () => {},
    } as unknown as Response;

    expect(
      await getVideoUseCase.execute({
        res: res,
        urlVideo: 'url',
      }),
    ).toBeUndefined();

    expect(fetchSpy).toHaveBeenCalled();
  });
});
