# Parabank Test Automation (Playwright)

This repository contains automated tests for the Parabank demo application, implemented using [Playwright](https://playwright.dev/).

The assessment covers three required scenarios:

1. **Register a new account** – Completing all required fields and verifying the user is logged in.
2. **Login** – Logging in with valid credentials and confirming redirection to the Accounts Overview page.
3. **Open a new account and view activity** – Creating a new account and verifying that the initial credit of $100 is received.

---

## Setup & Installation

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# View the test report
npx playwright show-report
```

---

## Environment Variables

Environment variables are defined in .env.
An .env.example file is included for reference:

```env
BASE_URL=https://parabank.parasoft.com
TEST_USERNAME=username123
TEST_PW=password123
```

Copy this file to .env and adjust values if needed.

---

## Notes on Site Stability

As Parabank is a public demo site, it is not consistently reliable.
The following issues were observed during test development:

### Registration

- Even when using randomly generated usernames (crypto.randomUUID()), registration sometimes fails with a “username already exists” error.

- This is due to the demo environment rather than the test code.

### Login

- auth.ts falls back to default credentials (username123 / password123) if no env vars are provided.

- Accounts are occasionally removed when the demo site resets, which may cause login tests to fail.

- The login helper also includes handling for intermittent server-side 5xx errors.

### Open New Account

- After creating an account, the test expects an initial $100 credit in the Account Activity table.

- At times, the transaction is missing or a different amount is displayed, again due to demo site instability.

---

## Assessment Considerations

- Tests are written to demonstrate correct flows and fail if functionality is broken.

- Code follows DRY principles with a reusable login helper.

- Assertions are included at key points (URL checks, headings, and table values).

- Documentation highlights demo site instability, which explains any intermittent failures.
