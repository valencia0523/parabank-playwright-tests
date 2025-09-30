export function assertCreds() {
  if (!process.env.PARABANK_USER || !process.env.PARABANK_PASSWORD) {
    throw new Error(
      'Missing credentials: set PARABANK_USER and PARABANK_PASSWORD in .env'
    );
  }
}
