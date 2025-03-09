import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { variablesEnv } from 'src/envs/variables.env';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = variablesEnv.jwtSecret;
  private readonly EXPIRES_IN = variablesEnv.jwtExpires;

  public generateToken(data: any): string {
    const jwtService = new JwtService();

    return jwtService.sign(data, {
      secret: this.JWT_SECRET,
      algorithm: 'HS256',
      expiresIn: this.EXPIRES_IN,
    });
  }
}
