import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CreateSimpleTokenUseCase } from '../use-cases/create-simple-token.use-case';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let createSimpleTokenUseCase: CreateSimpleTokenUseCase;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [CreateSimpleTokenUseCase, AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    createSimpleTokenUseCase = app.get<CreateSimpleTokenUseCase>(
      CreateSimpleTokenUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return object with token', () => {
    const createSimpleTokenUseCaseSpy = jest
      .spyOn(createSimpleTokenUseCase, 'execute')
      .mockReturnValue('token');

    expect(authController.generateSimpleToken()).toStrictEqual({
      access_token: 'token',
    });

    expect(createSimpleTokenUseCaseSpy).toHaveBeenCalled();
    expect(createSimpleTokenUseCaseSpy).toHaveBeenCalledTimes(1);
  });
});
