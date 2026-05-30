import { Module } from '@nestjs/common';
import { FileLoggerService } from './file-logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  providers: [FileLoggerService, LoggerMiddleware],
  exports: [FileLoggerService],
})
export class LoggerModule {}
