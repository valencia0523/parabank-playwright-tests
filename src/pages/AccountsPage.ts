import { Page, expect } from '@playwright/test';

export class AccountsPage {
  constructor(private readonly page: Page) {}

  // === Assertions ===
  async assertOverview(): Promise<void> {
    if (/index\.htm/i.test(this.page.url())) {
      await this.page.goto('/overview.htm');
    }
    await expect(
      this.page.getByRole('heading', { name: /accounts overview/i })
    ).toBeVisible({ timeout: 15000 });
  }

  // === Actions ===
  /**
   * Open a new account and return its generated ID.
   * Waits for navigation and validates the ID format.
   */
  async openNewAccount(
    type: 'CHECKING' | 'SAVINGS' = 'CHECKING'
  ): Promise<string> {
    await this.page.click('a[href*="openaccount.htm"]');
    await this.page.waitForURL(/openaccount\.htm/i);

    await expect(this.page.locator('#type')).toBeVisible();

    await this.page.selectOption('#type', {
      value: type === 'CHECKING' ? '0' : '1',
    });
    await this.page.selectOption('#fromAccountId', { index: 0 });

    await Promise.all([
      this.page.waitForURL(/openaccount\.htm/i),
      this.page.getByRole('button', { name: /open new account/i }).click(),
    ]);

    const idLabel = this.page.locator('#newAccountId');
    await expect(idLabel).toBeVisible();

    const newId = (await idLabel.textContent())?.trim() ?? '';
    if (!newId) throw new Error('Failed to capture new account id');
    return newId;
  }

  async goToAccountDetails(accountId: string): Promise<void> {
    await this.page.click(`a[href*="activity.htm?id=${accountId}"]`);
    await this.page.waitForURL(new RegExp(`activity\\.htm\\?id=${accountId}`));

    await expect(
      this.page.getByRole('heading', { name: /account details/i })
    ).toBeVisible();
  }
}
