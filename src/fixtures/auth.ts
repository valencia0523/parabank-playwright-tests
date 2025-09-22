import { chromium, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const AUTH_STATE_PATH = path.resolve(__dirname, 'auth.json');

const BASE_URL =
  process.env.BASE_URL ?? 'https://parabank.parasoft.com/parabank';
const USERNAME = process.env.PARABANK_USER ?? '';
const PASSWORD = process.env.PARABANK_PASSWORD ?? '';
const FORCE_AUTH = process.env.FORCE_AUTH === '1';

export async function ensureAuthState(): Promise<string> {
  if (!USERNAME || !PASSWORD) {
    throw new Error(
      '❌ Missing credentials. Please set PARABANK_USER and PARABANK_PASSWORD in .env'
    );
  }

  if (!FORCE_AUTH && fs.existsSync(AUTH_STATE_PATH)) {
    return AUTH_STATE_PATH;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    await page.fill('input[name="username"]', USERNAME);
    await page.fill('input[name="password"]', PASSWORD);

    await Promise.all([
      page.waitForURL(/overview\.htm/i), // 최신 방식
      page.click('input[type="submit"][value="Log In"], input[type="submit"]'),
    ]);

    await expect(page).toHaveURL(/overview\.htm/i);
    await expect(page.locator('h1, h2, h3')).toContainText(
      /Accounts Overview/i
    );

    await context.storageState({ path: AUTH_STATE_PATH });

    return AUTH_STATE_PATH;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  ensureAuthState()
    .then((p) => {
      console.log(`✅ Auth state saved at: ${p}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Failed to create auth state:', err);
      process.exit(1);
    });
}
