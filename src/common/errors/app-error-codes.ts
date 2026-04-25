export const AppErrorCode = {
  UserNotFound: 'USER_NOT_FOUND',
  EmailAlreadyExists: 'EMAIL_ALREADY_EXISTS',
} as const;

export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];
