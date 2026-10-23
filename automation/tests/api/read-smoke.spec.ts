import { expect, test } from '@playwright/test';
import { apiAuthHeaders, hasApiAuth } from '../../src/env';

test.beforeEach(() => {
  test.skip(!hasApiAuth(), 'Set DAM_TOKEN or DAM_API_KEY in automation/.env');
});

test('API-SET-R01 system settings are readable', async ({ request }) => {
  const response = await request.get('/SystemSettings', { headers: apiAuthHeaders() });
  expect(response.status(), await response.text()).toBe(200);
  const body = await response.json();
  expect(typeof body.isDocumentTextSearchEnabled).toBe('boolean');
});

test('API-TAX-R01 library categories are readable', async ({ request }) => {
  const response = await request.get('/Taxonomy/Category/Library', { headers: apiAuthHeaders() });
  expect(response.status(), await response.text()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});

test('API-AST-SRCH-06 search pages do not overlap', async ({ request }) => {
  const headers = { ...apiAuthHeaders(), 'Content-Type': 'application/json' };
  const pageSize = 24;

  async function search(page: number) {
    const response = await request.post('/Asset/Search', {
      headers,
      data: { page, pageSize },
    });
    expect(response.status(), await response.text()).toBe(200);
    return response.json();
  }

  const first = await search(0);
  const second = await search(1);
  const firstIds = (first.assets ?? []).map((asset: { id: number }) => asset.id);
  const secondIds = (second.assets ?? []).map((asset: { id: number }) => asset.id);

  expect(firstIds.length).toBeLessThanOrEqual(pageSize);
  expect(secondIds.length).toBeLessThanOrEqual(pageSize);
  expect(typeof first.totalHits).toBe('number');
  expect(second.totalHits).toBe(first.totalHits);
  expect(firstIds.filter((id: number) => secondIds.includes(id))).toEqual([]);
});
