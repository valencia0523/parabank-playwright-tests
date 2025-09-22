import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL =
  process.env.BASE_URL ?? 'https://parabank.parasoft.com/parabank';
const CI = !!process.env.CI;

const storageStatePath = path.resolve(__dirname, 'src/fixtures/auth.json');
const hasAuthState = fs.existsSync(storageStatePath);

export default defineConfig({
  testDir: path.resolve(__dirname, 'src/tests'),
  timeout: 30_000,
  expect: { timeout: 5_000 },

  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,

  reporter: [
    [
      'html',
      {
        outputFolder: path.resolve(__dirname, 'reports/playwright-report'),
        open: 'never',
      },
    ],
  ],

  use: {
    baseURL: BASE_URL,
    storageState: hasAuthState ? storageStatePath : undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  outputDir: path.resolve(__dirname, 'reports/test-results'),
});
