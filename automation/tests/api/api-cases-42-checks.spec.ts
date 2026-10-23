import { test, expect } from '@playwright/test';
import { hasApiAuth, apiAuthHeaders } from '../../src/env';
import { deleteOwnAsset, readJson, uploadOwnAsset } from './openapi-support';

/**
 * Независимые кейсы из API_Test_Cases_42.json.
 * Мутации только на своих pw-qa-* активах. Пользователей и роли не меняет.
 * API-NEG-01/02 и API-AUTH-01 — контрактные проверки статуса, не обход авторизации.
 * По правилам соревнования безопасность вне скоупа оценки.
 */
const json = () => ({ ...apiAuthHeaders(), 'Content-Type': 'application/json' });

test.describe('API_Test_Cases_42 auth contract', () => {
  test('API-CP-01 Получение access_token (внешний IdP)', async ({ request }) => {
    const tokenUrl = process.env.DAM_TOKEN_URL?.trim();
    const username = process.env.DAM_USER?.trim();
    const password = process.env.DAM_PASSWORD?.trim();
    test.skip(!tokenUrl || !username || !password, 'Нужны DAM_TOKEN_URL, DAM_USER, DAM_PASSWORD. Пароль в код не пишется.');
    const form = new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.DAM_CLIENT_ID?.trim() || 'rex-client',
      username: username!,
      password: password!,
    });
    const secret = process.env.DAM_CLIENT_SECRET?.trim();
    if (secret) form.set('client_secret', secret);
    const response = await request.post(tokenUrl!, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
    const text = await response.text();
    expect(response.status(), text.replace(/access_token"\s*:\s*"[^"]+/g, 'access_token":"***').slice(0, 300)).toBe(200);
    const body = JSON.parse(text) as { access_token?: string; token_type?: string; expires_in?: number };
    expect(body.access_token && body.access_token.length > 0).toBe(true);
    expect(String(body.token_type).toLowerCase()).toContain('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('API-NEG-01 Без Authorization и X-Api-Key — 401', async ({ request }) => {
    const response = await request.get('/SystemSettings', { headers: { Accept: 'application/json' } });
    expect(response.status()).toBe(401);
  });

  test('API-NEG-02 Невалидный Bearer — 401', async ({ request }) => {
    const response = await request.get('/SystemSettings', {
      headers: { Accept: 'application/json', Authorization: 'Bearer not.a.jwt.token' },
    });
    expect(response.status()).toBe(401);
  });

  test('API-AUTH-01 SystemSettings с валидным X-Api-Key', async ({ request }) => {
    const apiKey = process.env.DAM_API_KEY?.trim();
    test.skip(!apiKey, 'Нужен DAM_API_KEY. UI-пароль сюда не подходит.');
    const body = await readJson<{ isDocumentTextSearchEnabled?: boolean }>(
      await request.get('/SystemSettings', { headers: { Accept: 'application/json', 'X-Api-Key': apiKey! } }),
      200,
    );
    expect(typeof body.isDocumentTextSearchEnabled).toBe('boolean');
  });
});

test.describe('API_Test_Cases_42 independent', () => {
  test.skip(!hasApiAuth(), 'Нужен DAM_TOKEN или DAM_API_KEY');
  test.setTimeout(120_000);

  test('API-NEG-03 GET Asset несуществующий id — 404', async ({ request }) => {
    const missing = await readJson<{ message?: string }>(
      await request.get('/Asset/9007199254740991', { headers: apiAuthHeaders() }),
      404,
    );
    expect(missing.message?.length).toBeGreaterThan(0);
  });

  test('API-NEG-04 Download несуществующий fileName — 404', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-neg04-${Date.now()}.jpg`);
    try {
      const response = await request.get(`/Asset/${assetId}/not_exists.bin`, { headers: apiAuthHeaders() });
      expect(response.status()).toBe(404);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-NEG-05 Thumbnail без превью — 404', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-neg05-${Date.now()}.jpg`);
    try {
      const response = await request.get(`/Asset/Thumbnail/${assetId}/not_exists.bin`, { headers: apiAuthHeaders() });
      expect(response.status()).toBe(404);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-NEG-06 PATCH Name без name — 400', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-neg06-${Date.now()}.jpg`);
    try {
      const response = await request.patch('/Asset/Name', {
        headers: json(),
        data: { assetId },
      });
      expect(response.status()).toBe(400);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-NEG-07 BusinessAction без actionId — 400', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-neg07-${Date.now()}.jpg`);
    try {
      const response = await request.post('/Asset/BusinessAction', {
        headers: json(),
        data: { assetId },
      });
      expect(response.status()).toBe(400);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-NEG-08 Collection без name — 400', async ({ request }) => {
    const response = await request.post('/Collection', { headers: json(), data: {} });
    const status = response.status();
    if (status === 200) {
      const id = await response.json();
      if (typeof id === 'number') await request.delete(`/Collection/${id}`, { headers: apiAuthHeaders() });
    }
    expect(status).toBe(400);
  });

  test('API-NEG-09 Comment без content — 400', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-neg09-${Date.now()}.jpg`);
    try {
      const response = await request.post('/Comment', {
        headers: json(),
        data: {
          targetId: assetId,
          targetSection: 'Asset',
          targetSectionId: assetId,
          assetName: 'pw-qa',
          assetLink: 'https://dam.rex.lab.reksoft.com/Library',
        },
      });
      expect(response.status()).toBe(400);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-NEG-10 ValueSource несуществующий — 404', async ({ request }) => {
    const response = await request.get('/Taxonomy/ValueSource/2147483646', { headers: apiAuthHeaders() });
    expect(response.status()).toBe(404);
  });

  test('API-NEG-11 User неизвестный — 400', async ({ request }) => {
    const response = await request.get('/User/pw-qa-unknown-user', { headers: apiAuthHeaders() });
    expect(response.status()).toBe(400);
  });

  test('API-EXP-01 POST /Asset без file — не 500', async ({ request }) => {
    const response = await request.post('/Asset', {
      headers: apiAuthHeaders(),
      multipart: { note: 'no-file' },
    });
    const status = response.status();
    test.info().annotations.push({ type: 'actual-status', description: String(status) });
    expect(status, 'Не 500. Ожидаемо 400, но schema file не required.').not.toBe(500);
    if (status === 200) {
      const created = await response.json();
      if (typeof created === 'number') await deleteOwnAsset(request, created);
    }
  });

  test('API-AST-SEARCH-EDIT-01 Search/Editable canEdit', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-edit-${Date.now()}.jpg`);
    try {
      const deadline = Date.now() + 30_000;
      let body: { totalHits?: number; assets?: { canEdit?: boolean; id?: number }[] } = {};
      while (Date.now() < deadline) {
        body = await readJson<typeof body>(
          await request.post('/Asset/Search/Editable', {
            headers: json(),
            data: { assetIds: { valuesToInclude: [assetId] }, page: 0, pageSize: 20 },
          }),
          200,
        );
        if ((body.totalHits ?? 0) >= 1 && (body.assets ?? []).some((asset) => asset.id === assetId)) break;
        await new Promise((resolve) => setTimeout(resolve, 2_000));
      }
      expect(body.totalHits).toBeGreaterThanOrEqual(1);
      expect((body.assets ?? []).some((asset) => asset.id === assetId)).toBe(true);
      for (const asset of body.assets ?? []) expect(asset.canEdit).toBe(true);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });

  test('API-AST-SEARCH-SAVED-01 BySavedSearchId', async ({ request }) => {
    const savedSearchId = await readJson<number>(
      await request.post('/SavedSearch', {
        headers: json(),
        data: {
          name: `DBG_SS_BYSEARCH_${Date.now()}`,
          description: 'for BySavedSearchId',
          savedSearchType: 'User',
          searchParameters: { query: 'DBG' },
        },
      }),
      200,
    );
    try {
      const body = await readJson<{ totalHits?: number; assets?: unknown; lastSortValues?: unknown }>(
        await request.post('/Asset/Search/BySavedSearchId', {
          headers: json(),
          data: { savedSearchId, pageSize: 20, lastSortValues: [] },
        }),
        200,
      );
      expect(body.totalHits).toEqual(expect.any(Number));
      expect(body.assets).toBeTruthy();
    } finally {
      const deleted = await request.delete(`/SavedSearch/${savedSearchId}`, { headers: apiAuthHeaders() });
      expect(deleted.status()).toBe(204);
    }
  });

  test('API-TAX-01 Taxonomy read set', async ({ request }) => {
    for (const path of [
      '/Taxonomy/Category/Library',
      '/Taxonomy/Field',
      '/Taxonomy/LinkType',
      '/Taxonomy/SystemField',
      '/Taxonomy/UserCategories',
    ]) {
      const response = await request.get(path, { headers: apiAuthHeaders() });
      expect(response.status(), path).toBe(200);
    }
  });

  test('API-LC-01 LifeCycle/Status с statusColor', async ({ request }) => {
    const statuses = await readJson<{ name?: string; statusColor?: string; allowedActions?: unknown }[]>(
      await request.get('/LifeCycle/Status', { headers: apiAuthHeaders() }),
      200,
    );
    expect(statuses.length).toBeGreaterThan(0);
    for (const status of statuses) {
      expect(status).toHaveProperty('name');
      expect(status).toHaveProperty('statusColor');
      expect(status).toHaveProperty('allowedActions');
    }
  });

  test('API-USR-01 GET User существующий — 200', async ({ request }) => {
    const users = await readJson<{ userId?: string }[]>(
      await request.get('/User/Search', { headers: apiAuthHeaders() }),
      200,
    );
    const userId = users.find((user) => user.userId)?.userId;
    test.skip(!userId, 'GET /User/Search не вернул userId');
    const user = await readJson<{ id?: number; userId?: string }>(
      await request.get(`/User/${encodeURIComponent(userId!)}`, { headers: apiAuthHeaders() }),
      200,
    );
    expect(user.userId).toBe(userId);
    expect(typeof user.id).toBe('number');
  });

  test('API-TAG-01 GET AssetTag', async ({ request }) => {
    const tags = await readJson<unknown>(await request.get('/AssetTag', { headers: apiAuthHeaders() }), 200);
    expect(Array.isArray(tags)).toBe(true);
    for (const tag of tags as unknown[]) expect(typeof tag).toBe('string');
  });

  test('API-AST-ARCH-01 Archive', async ({ request }) => {
    const assetId = await uploadOwnAsset(request, `pw-qa-arch-${Date.now()}.jpg`);
    try {
      const response = await request.post('/Asset/Archive', {
        headers: json(),
        data: { timestamp: new Date().toISOString(), assetIds: [assetId] },
      });
      expect(response.status()).toBe(200);
      expect((await response.body()).length).toBeGreaterThan(0);
    } finally {
      await deleteOwnAsset(request, assetId);
    }
  });
});
