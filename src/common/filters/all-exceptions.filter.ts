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
      return {
        status: exception.getStatus(),
        body: {
          success: false,
          statusCode: exception.getStatus(),
          message: this.messageFromHttpException(exception),
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

  private messageFromHttpException(
    exception: HttpException,
  ): string | string[] {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const msg = (response as { message: string | string[] }).message;
      return msg;
    }
    return exception.message;
  }
}
