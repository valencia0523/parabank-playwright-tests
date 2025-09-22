import { Page, expect } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator(selectors.login.form)).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.fill(selectors.login.username, username);
    await this.page.fill(selectors.login.password, password);

    await Promise.all([
      this.page.waitForURL(/overview\.htm/i),
      this.page.click(selectors.login.submit),
    ]);

    await expect(this.page).toHaveURL(/overview\.htm/i);
  }

  async logoutIfVisible() {
    const logoutLink = this.page.locator(selectors.nav.logout);
    if (await logoutLink.isVisible({ timeout: 1000 }).catch(() => false)) {
      await logoutLink.click();
      await this.page.waitForURL(/index\.htm|parabank\/?$/i);
    }
  }
}
