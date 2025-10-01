import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { BASE_URL, AUTH_STATE_PATH, FORCE_AUTH } from './src/utils/env';

const CI = !!process.env.CI;
const hasAuthState = !FORCE_AUTH && fs.existsSync(AUTH_STATE_PATH);

export default defineConfig({
  testDir: path.resolve(__dirname, 'src/tests'),
  timeout: 30_000,
  expect: { timeout: CI ? 10_000 : 5_000 },

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
    storageState: hasAuthState ? AUTH_STATE_PATH : undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  outputDir: path.resolve(__dirname, 'reports/test-results'),
});
