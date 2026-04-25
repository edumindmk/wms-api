import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AppErrorCode } from './app-error-codes';

export type AppErrorResponseBody = {
  code: AppErrorCode;
  message: string | string[];
  statusCode: number;
};

function appErrorBody(
  code: AppErrorCode,
  message: string,
  statusCode: number,
): AppErrorResponseBody {
  return { code, message, statusCode };
}

export function throwUserNotFound(): never {
  throw new NotFoundException(
    appErrorBody(
      AppErrorCode.UserNotFound,
      'User not found',
      HttpStatus.NOT_FOUND,
    ),
  );
}

export function throwEmailAlreadyExists(): never {
  throw new ConflictException(
    appErrorBody(
      AppErrorCode.EmailAlreadyExists,
      'Email already exists',
      HttpStatus.CONFLICT,
    ),
  );
}
