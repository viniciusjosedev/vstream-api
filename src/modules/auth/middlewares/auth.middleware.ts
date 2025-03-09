import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { variablesEnv } from 'src/envs/variables.env';
import crypto from 'crypto';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers.authorization?.split(' ')[1];
    const signature = request.headers['X-Signature'];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: variablesEnv.jwtSecret,
      });

      const { publicKey } = payload;

      if (signature) {
        const requestData = {
          path: request.path,
          body: request.body,
          method: request.method,
        };

        const verifier = crypto.createVerify('SHA256');
        verifier.update(JSON.stringify(requestData)).end();

        const isValid = verifier.verify(
          publicKey,
          signature as string,
          'base64',
        );

        if (!isValid) {
          throw new UnauthorizedException();
        }
      } else {
        const { passphrase } = payload;

        if (passphrase !== variablesEnv.jwtPassphrase) {
          throw new UnauthorizedException();
        }

        return true;
      }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
