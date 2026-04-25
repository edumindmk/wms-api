import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return super.catch(exception, host);
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { status, body } = this.mapException(exception, req.url);

    res.status(status).json(body);
  }

  private mapException(
    exception: unknown,
    path: string,
  ): { status: number; body: Record<string, unknown> } {
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const { code, message } = this.payloadFromHttpException(exception);
      return {
        status: exception.getStatus(),
        body: {
          success: false,
          statusCode: exception.getStatus(),
          ...(code && { code }),
          message,
          path,
          timestamp,
        },
      };
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path,
        timestamp,
      },
    };
  }

  private payloadFromHttpException(exception: HttpException): {
    code?: string;
    message: string | string[];
  } {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return { message: response };
    }
    if (typeof response === 'object' && response !== null) {
      const r = response as Record<string, unknown>;
      const message =
        'message' in r &&
        (typeof r.message === 'string' || Array.isArray(r.message))
          ? (r.message as string | string[])
          : exception.message;
      const code = typeof r.code === 'string' ? r.code : undefined;
      return { code, message };
    }
    return { message: exception.message };
  }
}
