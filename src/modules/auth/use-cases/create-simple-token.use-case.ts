import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { variablesEnv } from 'src/envs/variables.env';

@Injectable()
export class CreateSimpleTokenService {
  public execute() {
    const authService = new AuthService();

    return authService.generateToken({
      passphrase: variablesEnv.jwtPassphrase,
    });
  }
}
