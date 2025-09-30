import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // Navigate to login page and verify form is loaded
  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('form[action*="login.htm"]')).toBeVisible();
  }

  // Perform login and wait until redirected to Accounts Overview
  async login(username: string, password: string): Promise<void> {
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);

    // Click login and synchronise with expected landing page
    await Promise.all([
      this.page.waitForURL(/overview\.htm/i, { timeout: 10_000 }),
      this.page.getByRole('button', { name: /log in/i }).click(),
    ]);

    await expect(this.page).toHaveURL(/overview\.htm/i);
  }

  // Log out only if a logout link is present (safe to call unconditionally)
  async logoutIfVisible(): Promise<void> {
    const logoutLink = this.page.locator('a[href*="logout.htm"]');
    const visible = await logoutLink
      .isVisible({ timeout: 1000 })
      .catch(() => false); // swallow timeout errors for optional check
    if (!visible) return;

    await Promise.all([
      this.page.waitForURL(/(?:index\.htm|parabank\/?)$/i, { timeout: 10_000 }),
      logoutLink.click(),
    ]);
  }

  // Lightweight check to confirm user is authenticated
  async isLoggedIn(): Promise<boolean> {
    if (/overview\.htm/i.test(this.page.url())) return true;
    const heading = this.page
      .locator('h1, h2, h3')
      .filter({ hasText: /accounts overview/i });
    return (await heading.count()) > 0;
  }
}
