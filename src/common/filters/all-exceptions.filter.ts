import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status || 500;

    response.status(status).json({
      success: false,
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}
