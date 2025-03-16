import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
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

@Catch(HttpException)
@Injectable()
export class ExceptionInterceptor implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    const messageResponse = exception.getResponse();
    let message = 'An error occurred';
    let statusCode = 500;

    if (typeof messageResponse === 'object') {
      message = (messageResponse as any)?.message || message;
      statusCode = (messageResponse as any)?.statusCode || statusCode;
    }

    response.status(status).json({
      message,
      statusCode,
      success: false,
    });
  }
}
