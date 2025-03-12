import { Test, TestingModule } from '@nestjs/testing';
import { CreateSimpleTokenService } from './create-simple-token.use-case';
import { AuthService } from '../services/auth.service';

describe('CreateSimpleTokenService', () => {
  let createSimpleTokenService: CreateSimpleTokenService;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CreateSimpleTokenService, AuthService],
    }).compile();

    createSimpleTokenService = app.get<CreateSimpleTokenService>(
      CreateSimpleTokenService,
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

    expect(createSimpleTokenService.execute()).toBe('token');

    expect(authServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy).toHaveBeenCalledTimes(1);
  });
});
