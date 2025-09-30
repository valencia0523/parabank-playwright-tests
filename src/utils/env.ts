import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root (two levels up from /utils)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// === Base application settings ===
export const BASE_URL =
  process.env.BASE_URL ?? 'https://parabank.parasoft.com/parabank';

// Credentials (must be set in .env for local/dev runs)
export const USERNAME = process.env.PARABANK_USER ?? '';
export const PASSWORD = process.env.PARABANK_PASSWORD ?? '';

// Runtime flags (mainly for CI / local dev convenience)
export const FORCE_AUTH = (process.env.FORCE_AUTH ?? '') === '1'; // force new login even if state file exists
export const HEADLESS = (process.env.HEADLESS ?? '1') !== '0'; // default headless on, set 0 to debug locally

// Storage for Playwright auth state
export const AUTH_STATE_PATH =
  process.env.AUTH_STATE_PATH ??
  path.resolve(__dirname, '../fixtures/auth.json');
