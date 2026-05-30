import { Injectable } from '@nestjs/common';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileLoggerService {
  private readonly logsDir = join(process.cwd(), 'logs');

  log(level: string, message: string): void {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;

    appendFileSync(join(this.logsDir, `${date}.log`), line);
  }
}
