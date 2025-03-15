import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  success: boolean;
  data: T;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object') {
          return {
            success: true,
            data,
            statusCode: context.switchToHttp().getResponse<Response>()
              .statusCode,
          };
        }
        return data as ResponseFormat<T>;
      }),
    );
  }
}
