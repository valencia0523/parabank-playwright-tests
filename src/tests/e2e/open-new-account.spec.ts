import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Open New Account', () => {
  test('open checking account and view details (@regression)', async ({
    page,
  }) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await lp.login(process.env.PARABANK_USER!, process.env.PARABANK_PASSWORD!);

    const ap = new AccountsPage(page);
    await ap.assertOverview();

    const newAccountId = await ap.openNewAccount('CHECKING');
    expect(newAccountId).toMatch(/^\d+$/);

    await ap.goToAccountDetails(newAccountId);
    await expect(page.locator('table, .ng-scope')).toBeVisible();
  });
});
