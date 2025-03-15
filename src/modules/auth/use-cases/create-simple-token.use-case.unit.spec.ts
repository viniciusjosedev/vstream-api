import { Test, TestingModule } from '@nestjs/testing';
import { CreateSimpleTokenUseCase } from './create-simple-token.use-case';
import { AuthService } from '../services/auth.service';

describe('CreateSimpleTokenService', () => {
  let createSimpleTokenUseCase: CreateSimpleTokenUseCase;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CreateSimpleTokenUseCase, AuthService],
    }).compile();

    createSimpleTokenUseCase = app.get<CreateSimpleTokenUseCase>(
      CreateSimpleTokenUseCase,
    );
    authService = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return token', () => {
    const authServiceSpy = jest
      .spyOn(authService, 'generateToken')
      .mockReturnValue('token');

    expect(createSimpleTokenUseCase.execute()).toBe('token');

    expect(authServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy).toHaveBeenCalledTimes(1);
  });
});
