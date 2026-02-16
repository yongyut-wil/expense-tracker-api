import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@nestjs/common';
import type { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) || exception.message;
        if (Array.isArray(res.message)) {
          message = res.message[0] as string;
          details = res.message;
        }
      }

      code = this.getErrorCode(status);
    } else if (exception instanceof Error) {
      // Log unexpected errors with full stack trace
      this.logger.error(
        `Unexpected error at ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );
      message = exception.message;
    } else {
      // Log completely unknown errors
      this.logger.error(
        `Unknown error at ${request.method} ${request.url}:`,
        exception,
      );
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code,
        message,
        details: details ?? undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}
