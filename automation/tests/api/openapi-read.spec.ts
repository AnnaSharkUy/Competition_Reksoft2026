import { expect, test } from '@playwright/test';
import { hasApiAuth } from '../../src/env';
import { assetIds, expectStatus, jsonHeaders } from './openapi-support';

/**
 * Контракт DAM Service API 1.7.1.1157, только чтение.
 * Пользователей, роли и чужие активы не меняет.
 * Безопасность вне скоупа соревнования — проверки обхода авторизации здесь нет.
 */
test.beforeEach(() => {
  test.skip(!hasApiAuth(), 'Заполните DAM_TOKEN или DAM_API_KEY в automation/.env. Пароль UI в OpenAPI не принимается.');
});

test('API-OAS-SET-01 GET /SystemSettings возвращает признак документа', async ({ request }) => {
  const response = await request.get('/SystemSettings', { headers: jsonHeaders() });
  await expectStatus(response, 200);
  const body = await response.json();
  expect(typeof body.isDocumentTextSearchEnabled).toBe('boolean');
});

test('API-OAS-SET-02 GET /SystemSettings/CreationProcesses отдаёт имена процессов', async ({ request }) => {
  const response = await request.get('/SystemSettings/CreationProcesses', { headers: jsonHeaders() });
  await expectStatus(response, 200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  if (body.length > 0 && typeof body[0] === 'object') {
    expect(body[0], 'в процесс создания нужно поле name, его отправляют как processName').toHaveProperty('name');
  }
});

test('API-OAS-TAX-01 справочники библиотеки читаются', async ({ request }) => {
  for (const path of [
    '/Taxonomy/Category/Library',
    '/Taxonomy/UserCategories',
    '/Taxonomy/SystemField',
    '/Taxonomy/Field',
    '/Taxonomy/LinkType',
    '/LifeCycle/Status',
    '/AssetTag',
    '/Collection',
    '/SavedSearch/User',
  ]) {
    const response = await request.get(path, { headers: jsonHeaders() });
    await expectStatus(response, 200);
    const body = await response.json();
    expect(Array.isArray(body), path).toBe(true);
  }
});

test('API-OAS-SRCH-01 пустой Search допустим и не зашивает количество', async ({ request }) => {
  const response = await request.post('/Asset/Search', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize: 24 },
  });
  await expectStatus(response, 200);
  const body = await response.json();
  expect(typeof body.totalHits).toBe('number');
  expect(Array.isArray(body.assets)).toBe(true);
  expect(body.assets.length).toBeLessThanOrEqual(24);
  expect(body.assets.length).toBeLessThanOrEqual(body.totalHits);
});

test('API-OAS-SRCH-02 страницы поиска не повторяют id', async ({ request }) => {
  const pageSize = 24;
  const firstResponse = await request.post('/Asset/Search', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize },
  });
  await expectStatus(firstResponse, 200);
  const first = await firstResponse.json();
  const secondResponse = await request.post('/Asset/Search', {
    headers: jsonHeaders(),
    data: { page: 1, pageSize },
  });
  await expectStatus(secondResponse, 200);
  const second = await secondResponse.json();
  const firstIds = assetIds(first);
  const secondIds = assetIds(second);
  expect(firstIds.length).toBeLessThanOrEqual(pageSize);
  expect(secondIds.length).toBeLessThanOrEqual(pageSize);
  if (firstIds.length === pageSize) {
    expect(firstIds.filter((id) => secondIds.includes(id)), 'страница 0 и страница 1 не должны совпадать').toEqual([]);
  }
});

test('API-OAS-SRCH-03 лишнее поле поиска отклоняется', async ({ request }) => {
  const response = await request.post('/Asset/Search', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize: 1, notInContract: true },
  });
  await expectStatus(response, 400);
});

test('API-OAS-SRCH-04 Editable отдаёт только редактируемые, WithoutAggregation без обязательных агрегаций', async ({ request }) => {
  const editable = await request.post('/Asset/Search/Editable', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize: 10 },
  });
  await expectStatus(editable, 200);
  const editableBody = await editable.json();
  expect(Array.isArray(editableBody.assets)).toBe(true);
  for (const asset of editableBody.assets) {
    expect(asset.canEdit, 'Search/Editable обязан вернуть canEdit=true').toBe(true);
  }

  const plain = await request.post('/Asset/Search/WithoutAggregation', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize: 10 },
  });
  await expectStatus(plain, 200);
  const plainBody = await plain.json();
  expect(typeof plainBody.totalHits).toBe('number');
  expect(Array.isArray(plainBody.assets)).toBe(true);
  expect(plainBody).toHaveProperty('lastSortValues');
});

test('API-OAS-SRCH-05 запрос из одного символа не даёт 500', async ({ request }) => {
  const response = await request.post('/Asset/Search', {
    headers: jsonHeaders(),
    data: { page: 0, pageSize: 24, query: 'a', isDocumentTextSearch: false },
  });
  await expectStatus(response, 200);
  expect(typeof (await response.json()).totalHits).toBe('number');
});

test('API-OAS-AST-01 отсутствующий актив и файл дают 404, не 403', async ({ request }) => {
  const missingId = '9007199254740991';
  const asset = await request.get(`/Asset/${missingId}`, { headers: jsonHeaders() });
  await expectStatus(asset, 404);
  const file = await request.get(`/Asset/${missingId}/missing.jpg`, { headers: jsonHeaders() });
  await expectStatus(file, 404);
  const version = await request.get(`/Asset/Version/${missingId}`, { headers: jsonHeaders() });
  await expectStatus(version, 404);
});

test('API-OAS-TAX-02 отсутствующий справочник даёт 404', async ({ request }) => {
  const response = await request.get('/Taxonomy/ValueSource/9007199254740991', { headers: jsonHeaders() });
  await expectStatus(response, 404);
});

test('API-OAS-USR-01 неверный userId даёт 400, список пользователей только читается', async ({ request }) => {
  const missing = await request.get('/User/not-a-real-user-id', { headers: jsonHeaders() });
  await expectStatus(missing, 400);

  const search = await request.get('/User/Search', { headers: jsonHeaders() });
  await expectStatus(search, 200);
  expect(Array.isArray(await search.json())).toBe(true);
});
