import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import {
  BASE_URL,
  USERNAME,
  PASSWORD,
  FORCE_AUTH,
  HEADLESS,
  AUTH_STATE_PATH,
} from '../utils/env';
import { LoginPage } from '../pages/LoginPage';

// Ensure parent directory exists before writing files
function ensureDirFor(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Fail early if credentials are not set
function assertEnv() {
  if (!BASE_URL) throw new Error('Missing BASE_URL');
  if (!USERNAME || !PASSWORD) {
    throw new Error('Missing credentials: Create credentials in .env');
  }
}

// Main helper to guarantee a valid Playwright auth state
export async function ensureAuthState() {
  assertEnv();

  // Reuse existing auth state unless FORCE_AUTH is set
  if (!FORCE_AUTH && fs.existsSync(AUTH_STATE_PATH)) {
    return AUTH_STATE_PATH;
  }

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  try {
    // Perform login via Page Object
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);

    // Persist storage state for later test runs
    ensureDirFor(AUTH_STATE_PATH);
    await context.storageState({ path: AUTH_STATE_PATH });
    return AUTH_STATE_PATH;
  } catch (error) {
    try {
      // Capture screenshot for debugging failed login attempts
      ensureDirFor('reports/test-results');
      await page.screenshot({
        path: 'reports/test-results/auth-fail.png',
        fullPage: true,
      });
    } catch {
      // ignore secondary screenshot errors
    }
    throw error;
  } finally {
    await browser.close();
  }
}

// CLI entry point: allows running this script directly (e.g. `ts-node auth.ts`)
if (require.main === module) {
  ensureAuthState()
    .then((p) => {
      console.log(`Auth state saved at: ${p}`);
      process.exit(0);
    })
    .catch((err) => {
      console.log('Failed to create auth state:\n,', err?.message ?? err);
      process.exit(1);
    });
}
