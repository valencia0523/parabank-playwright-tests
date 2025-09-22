import { test, expect } from '@playwright/test';

const CUSTOMER_ID = process.env.CUSTOMER_ID ?? '12212';

test.describe('Customer API', () => {
  test('GET customer by id returns 200 and minimal schema', async ({
    request,
    baseURL,
  }, testInfo) => {
    const apiBase =
      baseURL?.replace(/\/parabank\/?$/i, '') ??
      'https://parabank.parasoft.com';
    const url = `${apiBase}/parabank/services/bank/customers/${CUSTOMER_ID}`;

    const res = await request.get(url, {
      headers: {
        Accept: 'application/json, text/xml, application/xml;q=0.9, */*;q=0.8',
      },
    });

    expect(res.status(), `Unexpected status for ${url}`).toBe(200);

    const contentType = res.headers()['content-type'] ?? '';
    await testInfo.attach('response-headers', {
      body: JSON.stringify(res.headers(), null, 2),
      contentType: 'application/json',
    });

    if (contentType.includes('application/json')) {
      const body = await res.json();

      expect(body).toHaveProperty('id');
      expect(String(body.id)).toMatch(/^\d+$/);
      expect(body).toHaveProperty('firstName');
      expect(body).toHaveProperty('lastName');

      await testInfo.attach('response-json', {
        body: JSON.stringify(body, null, 2),
        contentType: 'application/json',
      });
    } else {
      const text = await res.text();

      await testInfo.attach('response-text', {
        body: text.slice(0, 2000),
        contentType: 'text/plain',
      });

      expect(text).toMatch(/<\?xml/i);
      expect(text).toMatch(/<customer[\s>]/i);
      expect(text).toMatch(/<id>\d+<\/id>/i);
    }
  });
});
