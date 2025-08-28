import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

// Fake test user info
function fakeUser() {
  return {
    firstName: "Valencia",
    lastName: "Jang",
    address: "1 Cambridge Road",
    city: "Cambridge",
    state: "CA",
    zipCode: "94016",
    phone: "4155551234",
    ssn: "123-45-6789",
    username: `valencia_${randomUUID()}`,
    password: `Pw_${randomUUID()}`,
  };
}

test("Register new account", async ({ page }) => {
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phone,
    ssn,
    username,
    password,
  } = fakeUser();

  await test.step("Navigate to register page", async () => {
    await page.goto("/parabank/index.htm", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Register" }).click();
    await expect(page).toHaveURL(/\/register\.htm/);
    await expect(
      page.getByRole("heading", { name: "Signing up is easy!" })
    ).toBeVisible();
  });

  await test.step("Fill & submit registration form and verify logged in state", async () => {
    const form = page.locator('form[action*="register"]');
    await form.locator('[id="customer.firstName"]').fill(firstName);
    await form.locator('[id="customer.lastName"]').fill(lastName);
    await form.locator('[id="customer.address.street"]').fill(address);
    await form.locator('[id="customer.address.city"]').fill(city);
    await form.locator('[id="customer.address.state"]').fill(state);
    await form.locator('[id="customer.address.zipCode"]').fill(zipCode);
    await form.locator('[id="customer.phoneNumber"]').fill(phone);
    await form.locator('[id="customer.ssn"]').fill(ssn);
    await form.locator('[id="customer.username"]').fill(username);
    await form.locator('[id="customer.password"]').fill(password);
    await form.locator('[id="repeatedPassword"]').fill(password);

    expect(await form.evaluate((f: HTMLFormElement) => f.checkValidity())).toBe(
      true
    );

    await form
      .getByRole("button", { name: /^register$/i })
      .click({ noWaitAfter: true });

    const logOut = page.getByRole("link", { name: /log out/i });
    const overview = page.getByRole("link", { name: /accounts overview/i });

    await expect(logOut).toBeVisible();
    await expect(overview).toBeVisible();
  });
});
