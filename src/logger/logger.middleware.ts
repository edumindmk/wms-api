import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FileLoggerService } from './file-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  constructor(private readonly fileLogger: FileLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const message = `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`;

      this.logger.log(message);
      this.fileLogger.log('INFO', message);
    });

    next();
  }
}
