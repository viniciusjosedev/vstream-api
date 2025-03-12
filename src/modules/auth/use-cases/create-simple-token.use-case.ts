import { Injectable } from '@nestjs/common';
import { variablesEnv } from 'src/envs/variables.env';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CreateSimpleTokenService {
  constructor(private readonly authService: AuthService) {}

  public execute() {
    return this.authService.generateToken({
      passphrase: variablesEnv.jwtPassphrase,
    });
  }
}
