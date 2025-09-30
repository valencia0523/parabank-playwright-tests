import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../../pages/LoginPage';
import { AccountsPage } from '../../pages/AccountsPage';
import { AUTH_STATE_PATH } from '../../utils/env';
import { assertCreds } from '../../utils/assertCreds';

// === Reuse stored auth state (CI > env > convention paths) ===
const CANDIDATE_STORAGE_STATES = [
  process.env.AUTH_STATE_PATH,
  AUTH_STATE_PATH,
  path.resolve('playwright/.auth/state.json'),
  path.resolve('playwright/.auth/storageState.json'),
].filter(Boolean) as string[];

const EXISTING_STORAGE = CANDIDATE_STORAGE_STATES.find((p) => fs.existsSync(p));
if (EXISTING_STORAGE) {
  test.use({ storageState: EXISTING_STORAGE });
}

// === Utility: perform login only if current session is invalid ===
async function loginIfNeeded(page: import('@playwright/test').Page) {
  await page.goto('/');

  const lp = new LoginPage(page);
  const already = await lp.isLoggedIn().catch(() => false);
  if (already) return;

  const loginForm = page.locator('form[action*="login.htm"]');
  const formVisible = await loginForm.isVisible().catch(() => false);
  if (formVisible) {
    assertCreds();
    await lp.login(process.env.PARABANK_USER!, process.env.PARABANK_PASSWORD!);
  }
}

// === Attach artefacts on failure (useful for CI debugging) ===
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach('failure-screenshot', {
      body: shot,
      contentType: 'image/png',
    });
  }
});

// === Tests ===
test.describe('Login / Session', () => {
  test('authenticated session shows Accounts Overview (@smoke)', async ({
    page,
  }) => {
    // Use existing session or login if required
    await loginIfNeeded(page);

    const ap = new AccountsPage(page);
    await ap.assertOverview();
  });

  test('explicit login via POM (@auth)', async ({ page }) => {
    // Validate login flow itself (not just session reuse)
    assertCreds();

    const lp = new LoginPage(page);
    await lp.goto();
    await lp.login(process.env.PARABANK_USER!, process.env.PARABANK_PASSWORD!);

    const ap = new AccountsPage(page);
    await ap.assertOverview();
  });
});
