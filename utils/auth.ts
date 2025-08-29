import { test, type Page } from "@playwright/test";

export type Credentials = { username: string; password: string };
export const defaultCreds: Credentials = {
  username: process.env.TEST_USERNAME ?? "john",
  password: process.env.TEST_PW ?? "demo",
};

/* Helper - Login */
export async function login(page: Page, creds: Credentials) {
  await test.step("Open login page", async () => {
    await page.goto("/parabank/index.htm");
  });

  const { username, password } = creds;
  const form = page.locator('form[name="login"]');

  await test.step("Fill login form", async () => {
    await test.step("Fill login form", async () => {
      await form.locator('input[name="username"]').fill(username);
      await form.locator('input[name="password"]').fill(password);
    });
  });

  test.step("Submit and wait for navigation", async () => {
    // Wait for either success (overview) or failure (login) page
    await Promise.all([
      page.waitForURL(/\/(overview|login)\.htm/i),
      form.locator('input[type="submit"]').click(),
    ]);
  });
}
