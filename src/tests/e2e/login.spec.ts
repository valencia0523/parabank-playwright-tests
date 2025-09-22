import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Login / Session', () => {
  test('authenticated session shows Accounts Overview (@smoke)', async ({
    page,
    baseURL,
  }) => {
    await page.goto(baseURL!);
    const accountsHeader = page.locator('h1, h2, h3');
    const loginForm = page.locator('form[action*="login.htm"]');

    if (await loginForm.isVisible().catch(() => false)) {
      const lp = new LoginPage(page);
      await lp.login(
        process.env.PARABANK_USER!,
        process.env.PARABANK_PASSWORD!
      );
    }

    await expect(accountsHeader).toContainText(/Accounts Overview/i);
  });

  test('explicit login via POM (@auth)', async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await lp.login(process.env.PARABANK_USER!, process.env.PARABANK_PASSWORD!);

    const ap = new AccountsPage(page);
    await ap.assertOverview();
  });
});
