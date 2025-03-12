import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CreateSimpleTokenService } from '../use-cases/create-simple-token.use-case';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let createSimpleTokenService: CreateSimpleTokenService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [CreateSimpleTokenService, AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    createSimpleTokenService = app.get<CreateSimpleTokenService>(
      CreateSimpleTokenService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return object with token', () => {
    const createSimpleTokenServiceSpy = jest
      .spyOn(createSimpleTokenService, 'execute')
      .mockReturnValue('token');

    expect(authController.generateSimpleToken()).toStrictEqual({
      access_token: 'token',
    });

    expect(createSimpleTokenServiceSpy).toHaveBeenCalled();
    expect(createSimpleTokenServiceSpy).toHaveBeenCalledTimes(1);
  });
});
