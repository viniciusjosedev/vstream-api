import { Injectable } from '@nestjs/common';
import { variablesEnv } from 'src/envs/variables.env';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CreateSimpleTokenService {
  public execute() {
    const authService = new AuthService();

    return authService.generateToken({
      passphrase: variablesEnv.jwtPassphrase,
    });
  }
}
