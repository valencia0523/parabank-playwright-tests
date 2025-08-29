import { test, expect } from "@playwright/test";
import { login, defaultCreds } from "../utils/auth";

test("Open a new account and view account activity", async ({ page }) => {
  await test.step("Login with valid credentials", async () => {
    await login(page, defaultCreds);
  });

  await test.step("Create CHECKING account and confirm success", async () => {
    // Wait for navigation and click together to avoid race condition
    await Promise.all([
      page.waitForURL(/\/openaccount\.htm/i),
      page.getByRole("link", { name: /^open new account$/i }).click(),
    ]);

    await page.locator("#type").selectOption("0");

    // select first enabled 'from account'
    const firstFromValue = await page
      .locator("#fromAccountId option:not([disabled])")
      .first()
      .getAttribute("value");
    await page.locator("#fromAccountId").selectOption(firstFromValue!);
    await page.getByRole("button", { name: /^open new account$/i }).click();

    await expect(
      page.getByRole("heading", { name: /^account opened!?$/i })
    ).toBeVisible();
    await expect(page.locator("#newAccountId")).toBeVisible();
  });

  await test.step("Open the new account’s Activity and verify $100 credit received", async () => {
    await page.locator("#newAccountId").click();

    await expect(
      page.getByRole("heading", { name: /^account activity$/i })
    ).toBeVisible();

    const row = page.locator("tr").filter({
      has: page.getByRole("link", { name: /^funds transfer received$/i }),
    });

    await expect(row.locator("td").nth(3)).toHaveText(/\$?100(?:\.00)?\b/);
  });
});
