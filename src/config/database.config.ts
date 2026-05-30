import type { TlsOptions } from 'tls';

export function getDatabaseSsl(): boolean | TlsOptions {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  return { rejectUnauthorized: false };
}

export function getDatabaseConnectionOptions() {
  return {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: getDatabaseSsl(),
  };
}
