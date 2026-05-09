export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT,
  /** Required at runtime for JWT (see auth.module / jwt.strategy). */
  jwtSecret: process.env.JWT_SECRET,
  /**
   * Not used by TypeORM in app.module (host/port/db credentials are separate).
   * For a single DATABASE_URL setup, wire it in TypeOrmModule instead.
   */
  databaseUrl: process.env.DATABASE_URL,
});
