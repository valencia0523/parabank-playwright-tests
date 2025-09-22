import { Page, expect } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class AccountsPage {
  constructor(private page: Page) {}

  async assertOverview() {
    await expect(this.page).toHaveURL(/overview\.htm/i);
    await expect(
      this.page.locator(selectors.accounts.overviewHeader)
    ).toContainText(/Accounts Overview/i);
  }

  async openNewAccount(type: 'CHECKING' | 'SAVINGS' = 'CHECKING') {
    await this.page.click(selectors.nav.openAccount);
    await this.page.waitForURL(/openaccount\.htm/i);

    await this.page.selectOption(selectors.accounts.newAccount.typeSelect, {
      value: type === 'CHECKING' ? '0' : '1',
    });
    await this.page.selectOption(
      selectors.accounts.newAccount.fromAccountSelect,
      { index: 0 }
    );

    await Promise.all([
      this.page.waitForURL(/openaccount\.htm\?newAccountId=\d+/i),
      this.page.click(selectors.accounts.newAccount.submit),
    ]);

    const newId =
      (
        await this.page
          .locator(selectors.accounts.newAccount.idLabel)
          .textContent()
      )?.trim() ?? '';
    expect(newId).toMatch(/^\d+$/);
    return newId;
  }

  async goToAccountDetails(accountId: string) {
    await this.page.click(selectors.accounts.details.link(accountId));
    await this.page.waitForURL(new RegExp(`activity\\.htm\\?id=${accountId}`));
    await expect(
      this.page.locator(selectors.accounts.details.header)
    ).toContainText(/Account Details/i);
  }
}
