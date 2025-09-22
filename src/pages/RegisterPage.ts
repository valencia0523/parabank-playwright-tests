import { Page, expect } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register.htm', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator(selectors.register.form)).toBeVisible();
  }

  async registerUser(user: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
  }) {
    await this.page.fill(selectors.register.firstName, user.firstName);
    await this.page.fill(selectors.register.lastName, user.lastName);
    await this.page.fill(selectors.register.address, user.address);
    await this.page.fill(selectors.register.city, user.city);
    await this.page.fill(selectors.register.state, user.state);
    await this.page.fill(selectors.register.zipCode, user.zipCode);
    await this.page.fill(selectors.register.phone, user.phone);
    await this.page.fill(selectors.register.ssn, user.ssn);
    await this.page.fill(selectors.register.username, user.username);
    await this.page.fill(selectors.register.password, user.password);
    await this.page.fill(selectors.register.passwordRepeat, user.password);

    await Promise.all([
      this.page.waitForURL(/(register|overview)\.htm/i),
      this.page.click(selectors.register.submit),
    ]);

    await expect(this.page.url()).toMatch(/(register|overview)\.htm/i);
  }
}
