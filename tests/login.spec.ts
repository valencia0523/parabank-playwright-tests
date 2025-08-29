import { test, expect } from "@playwright/test";
import { defaultCreds, login } from "../utils/auth";

test("Successful login redirects to Accounts Overview", async ({ page }) => {
  await test.step("Login with valid credentials", async () => {
    await login(page, defaultCreds);
  });

  await test.step("Verify destination (URL + heading)", async () => {
    await expect(page).toHaveURL(/\/overview\.htm/i);
    await expect(
      page.getByRole("heading", { name: /^accounts overview$/i })
    ).toBeVisible();
  });
});
