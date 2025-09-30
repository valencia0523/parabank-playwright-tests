import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AccountsPage } from '../../pages/AccountsPage';
import { assertCreds } from '../../utils/assertCreds';

test.describe('Open New Account', () => {
  test('open checking account and view details (@regression)', async ({
    page,
  }) => {
    assertCreds();

    // Ensure authenticated session (reuse if available, otherwise login)
    await page.goto('/');
    const loginForm = page.locator('form[action*="login.htm"]');
    if (await loginForm.isVisible().catch(() => false)) {
      const lp = new LoginPage(page);
      await lp.login(
        process.env.PARABANK_USER!,
        process.env.PARABANK_PASSWORD!
      );
    }

    const ap = new AccountsPage(page);
    await ap.assertOverview();

    // Create a new checking account and capture its ID
    const newAccountId = await ap.openNewAccount('CHECKING');
    expect(newAccountId).toMatch(/^\d+$/);

    // Navigate to the new account’s detail page
    await ap.goToAccountDetails(newAccountId);

    // Then verify account-specific UI, not URL again
    await expect(page.locator('#transactionTable')).toBeVisible();
  });
});
