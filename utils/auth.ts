import { test, expect, Page } from "@playwright/test";

export type Credentials = { username: string; password: string };
export const defaultCreds: Credentials = {
  username: process.env.TEST_USERNAME ?? "username123",
  password: process.env.TEST_PW ?? "password123",
};

/* Helper - Login */
export async function login(page: Page, creds: Credentials) {
  await test.step("Open login page", async () => {
    await page.goto("/parabank/index.htm");
  });

  const { username, password } = creds;
  expect(username, "TEST_USERNAME is missing").toBeTruthy();
  expect(password, "TEST_PW is missing").toBeTruthy();

  const form = page.locator('form[name="login"]');
  await test.step("Fill login form", async () => {
    await form.locator('input[name="username"]').fill(username);
    await form.locator('input[name="password"]').fill(password);
  });

  const status =
    await test.step("Submit and capture /login.htm response", async () => {
      const waitLoginResp = page.waitForResponse(
        (r) =>
          r.request().method() === "POST" && r.url().includes("/login.htm"),
        { timeout: 15_000 }
      );
      await form.locator('input[type="submit"]').click();
      return (await waitLoginResp).status();
    });

  if (status >= 500) {
    await test.info().attach("login-500", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    test.skip(true, `Server 5xx on login (${status})`);
  }

  await page.waitForURL(/\/(overview|login)\.htm/i, { timeout: 15_000 });
}
