if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    'e2e-test-jwt-secret-must-be-long-enough-for-hs256-signing';
}
