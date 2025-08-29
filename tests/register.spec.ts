import { test, expect } from "@playwright/test";

// Generate a unique fake user for each test run (timestamp in base36 prevents collisions)
function fakeUser() {
  const unique = Date.now().toString(36);
  return {
    firstName: "Valencia",
    lastName: "Jang",
    address: "1 Cambridge Road",
    city: "Cambridge",
    state: "CA",
    zipCode: "94016",
    phone: "4155551234",
    ssn: "123-45-6789",
    username: `test${unique}`.slice(0, 20),
    password: `Pw_${unique}`,
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
    await page.goto("/parabank/index.htm");
    await page.getByRole("link", { name: "Register" }).click();
    await expect(page).toHaveURL(/\/register\.htm/);
    await expect(
      page.getByRole("heading", { name: /^signing up is easy!?$/i })
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

    await form.getByRole("button", { name: /^register$/i }).click();

    await expect(page.getByRole("link", { name: /^log out$/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^accounts overview$/i })
    ).toBeVisible();
  });
});
