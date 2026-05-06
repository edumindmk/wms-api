export function isPostgresUniqueViolation(e: {
    code?: string;
    driverError?: { code?: string };
  }): boolean {
    return e.code === '23505' || e.driverError?.code === '23505';
  }
  