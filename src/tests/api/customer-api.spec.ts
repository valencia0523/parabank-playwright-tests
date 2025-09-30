import { test, expect } from '@playwright/test';

const CUSTOMER_ID = process.env.CUSTOMER_ID ?? '12212';

function resolveApiBase(baseURL?: string): string {
  // Extract scheme + host from Playwright baseURL; default to demo host if not available
  try {
    if (baseURL) {
      const u = new URL(baseURL);
      return `${u.protocol}//${u.host}`;
    }
  } catch {
    /* ignore and fall back below */
  }
  return 'https://parabank.parasoft.com';
}

test.describe('Customer API', () => {
  test('GET /customers/:id returns 200 and minimal schema (@api)', async ({
    request,
    baseURL,
  }, testInfo) => {
    const apiBase = resolveApiBase(baseURL);
    const url = `${apiBase}/parabank/services/bank/customers/${CUSTOMER_ID}`;

    const res = await request.get(url, {
      headers: {
        Accept: 'application/json, text/xml, application/xml;q=0.9, */*;q=0.8',
      },
    });

    expect(res.status(), `Unexpected status for ${url}`).toBe(200);

    const headers = res.headers();
    await testInfo.attach('response-headers', {
      body: JSON.stringify(headers, null, 2),
      contentType: 'application/json',
    });

    const contentType = headers['content-type'] ?? '';

    if (contentType.includes('application/json')) {
      const body = await res.json();

      await testInfo.attach('response-json', {
        body: JSON.stringify(body, null, 2),
        contentType: 'application/json',
      });

      // Minimal schema assertions
      expect(body).toHaveProperty('id');
      expect(String(body.id)).toMatch(/^\d+$/);
      expect(body).toHaveProperty('firstName');
      expect(typeof body.firstName).toBe('string');
      expect(String(body.firstName).trim().length).toBeGreaterThan(0);
      expect(body).toHaveProperty('lastName');
      expect(typeof body.lastName).toBe('string');
      expect(String(body.lastName).trim().length).toBeGreaterThan(0);
    } else if (
      contentType.includes('text/xml') ||
      contentType.includes('application/xml') ||
      contentType.includes('xml')
    ) {
      const text = await res.text();

      await testInfo.attach('response-xml', {
        body: text.slice(0, 2000),
        contentType: 'text/xml',
      });

      // Minimal structural checks
      expect(text).toMatch(/<\?xml/i);
      expect(text).toMatch(/<customer[\s>]/i);
      expect(text).toMatch(/<id>\d+<\/id>/i);
      expect(text).toMatch(/<firstName>[^<]+<\/firstName>/i);
      expect(text).toMatch(/<lastName>[^<]+<\/lastName>/i);
    } else {
      throw new Error(`Unsupported content-type "${contentType}" for ${url}`);
    }
  });
});
