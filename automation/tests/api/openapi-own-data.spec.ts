import { expect, test } from '@playwright/test';
import { apiAuthHeaders, hasApiAuth } from '../../src/env';
import {
  deleteOwnAsset,
  expectStatus,
  jsonHeaders,
  listOf,
  numericId,
  TINY_JPEG,
  uploadOwnAsset,
} from './openapi-support';

/**
 * Изменяющие проверки только на данных с префиксом pw-api-.
 * Чужие активы, пользователи и роли не удаляются.
 * AssetImport, Share и процессы по расписанию не вызываются: в спецификации это не штатный сценарий
 * либо действие задевает других пользователей.
 */
test.describe.configure({ mode: 'serial' });

test.beforeEach(() => {
  test.skip(!hasApiAuth(), 'Заполните DAM_TOKEN или DAM_API_KEY в automation/.env');
});

test('API-OAS-AST-02 свой актив создаётся, переименовывается и удаляется', async ({ request }) => {
  const fileName = `pw-api-${Date.now()}.jpg`;
  let assetId: number | undefined;
  try {
    assetId = await uploadOwnAsset(request, fileName);
    const created = await request.get(`/Asset/${assetId}`, { headers: jsonHeaders() });
    await expectStatus(created, 200);

    const newName = `${fileName}-renamed`;
    const renamed = await request.patch('/Asset/Name', {
      headers: jsonHeaders(),
      data: { assetId, name: newName },
    });
    await expectStatus(renamed, 204);

    const after = await request.get(`/Asset/${assetId}`, { headers: jsonHeaders() });
    await expectStatus(after, 200);
    const body = await after.json();
    const visibleName = JSON.stringify(body);
    expect(visibleName).toContain(newName);
  } finally {
    await deleteOwnAsset(request, assetId);
  }
});

test('API-OAS-AST-03 замена файла и восстановление версии только своего актива', async ({ request }) => {
  test.setTimeout(120_000);
  let assetId: number | undefined;
  try {
    assetId = await uploadOwnAsset(request, `pw-api-ver-${Date.now()}.jpg`);
    const replaced = await request.post(`/Asset/${assetId}/ReplaceFile`, {
      headers: apiAuthHeaders(),
      multipart: {
        file: { name: `pw-api-ver-2-${Date.now()}.jpg`, mimeType: 'image/jpeg', buffer: TINY_JPEG },
      },
    });
    await expectStatus(replaced, 204);

    const versions = await request.get(`/Asset/${assetId}/Versions`, { headers: jsonHeaders() });
    await expectStatus(versions, 200);
    const versionList = listOf(await versions.json());
    expect(versionList.length).toBeGreaterThan(0);
    const versionId = numericId(versionList[0], ['id', 'assetVersionId', 'versionId']);
    expect(versionId, 'у версии должен быть числовой id').toBeDefined();

    const restored = await request.post(`/Asset/RestoreVersion/${versionId}`, { headers: jsonHeaders() });
    await expectStatus(restored, 200);
  } finally {
    await deleteOwnAsset(request, assetId);
  }
});

test('API-OAS-AST-04 теги и категория меняются только у своего актива', async ({ request }) => {
  let assetId: number | undefined;
  try {
    assetId = await uploadOwnAsset(request, `pw-api-meta-${Date.now()}.jpg`);

    const tagsResponse = await request.get('/AssetTag', { headers: jsonHeaders() });
    await expectStatus(tagsResponse, 200);
    const tags = (await tagsResponse.json()) as unknown[];
    const tag = tags.find((item) => typeof item === 'string') as string | undefined;
    test.skip(!tag, 'На стенде нет существующего тега, новый тег в справочник не добавляем');

    const tagged = await request.patch('/Asset/Tags', {
      headers: jsonHeaders(),
      data: { assetId, tags: [tag] },
    });
    await expectStatus(tagged, 204);

    const categoriesResponse = await request.get('/Taxonomy/Category/Library', { headers: jsonHeaders() });
    await expectStatus(categoriesResponse, 200);
    const categoryId = listOf(await categoriesResponse.json())
      .map((item) => numericId(item, ['id', 'categoryId']))
      .find((id) => id !== undefined);
    test.skip(categoryId === undefined, 'В дереве библиотеки нет числового id категории');

    const categorized = await request.patch('/Asset/Categories', {
      headers: jsonHeaders(),
      data: { assetId, categories: [categoryId] },
    });
    await expectStatus(categorized, 204);
  } finally {
    await deleteOwnAsset(request, assetId);
  }
});

test('API-OAS-LINK-01 связь создаётся и удаляется между двумя своими активами', async ({ request }) => {
  const created: number[] = [];
  try {
    const linkTypes = await request.get('/Taxonomy/LinkType', { headers: jsonHeaders() });
    await expectStatus(linkTypes, 200);
    const linkTypeId = listOf(await linkTypes.json())
      .map((item) => numericId(item, ['id', 'linkTypeId']))
      .find((id) => id !== undefined);
    test.skip(linkTypeId === undefined, 'Нет числового linkTypeId, связь не создаём вслепую');

    const first = await uploadOwnAsset(request, `pw-api-link-a-${Date.now()}.jpg`);
    const second = await uploadOwnAsset(request, `pw-api-link-b-${Date.now()}.jpg`);
    created.push(first, second);

    const linked = await request.post('/AssetLink', {
      headers: jsonHeaders(),
      data: {
        assetId: first,
        assetsToLinkIds: [second],
        linkTypeId,
        isLinkFromParentToChild: true,
      },
    });
    await expectStatus(linked, 204);

    const list = await request.get(`/AssetLink/${first}`, { headers: jsonHeaders() });
    await expectStatus(list, 200);
    expect(Array.isArray(await list.json())).toBe(true);

    const deleted = await request.delete('/AssetLink', {
      headers: jsonHeaders(),
      data: { links: [{ asset1Id: first, asset2Id: second, linkTypeId }] },
    });
    await expectStatus(deleted, 204);
  } finally {
    for (const assetId of created.reverse()) await deleteOwnAsset(request, assetId);
  }
});

test('API-OAS-COL-01 своя коллекция создаётся, меняется и удаляется', async ({ request }) => {
  let collectionId: number | undefined;
  let assetId: number | undefined;
  try {
    assetId = await uploadOwnAsset(request, `pw-api-col-${Date.now()}.jpg`);
    const name = `pw-api-collection-${Date.now()}`;
    const created = await request.post('/Collection', {
      headers: jsonHeaders(),
      data: { name },
    });
    await expectStatus(created, 200);
    collectionId = await created.json();
    expect(typeof collectionId).toBe('number');

    const renamed = await request.patch('/Collection/Name', {
      headers: jsonHeaders(),
      data: { id: collectionId, name: `${name}-renamed` },
    });
    await expectStatus(renamed, 204);

    const added = await request.post('/Collection/Assets', {
      headers: jsonHeaders(),
      data: { id: collectionId, assetIds: [assetId] },
    });
    await expectStatus(added, 204);

    const removed = await request.delete('/Collection/Assets', {
      headers: jsonHeaders(),
      data: { id: collectionId, assetIds: [assetId] },
    });
    await expectStatus(removed, 204);

    const own = await request.get(`/Collection/${collectionId}`, { headers: jsonHeaders() });
    await expectStatus(own, 200);
  } finally {
    if (collectionId) {
      const deleted = await request.delete(`/Collection/${collectionId}`, { headers: jsonHeaders() });
      expect([204, 404]).toContain(deleted.status());
    }
    await deleteOwnAsset(request, assetId);
  }
});

test('API-OAS-SRCH-06 чужой savedSearchId отклоняется по контракту 400', async ({ request }) => {
  const response = await request.post('/Asset/Search/BySavedSearchId', {
    headers: jsonHeaders(),
    data: { savedSearchId: 900719925, pageSize: 10, lastSortValues: [] },
  });
  await expectStatus(response, 400);
});

test('API-OAS-SS-01 свой сохранённый поиск не кладёт page в searchParameters', async ({ request }) => {
  const invalid = await request.post('/SavedSearch', {
    headers: jsonHeaders(),
    data: {
      name: `pw-api-bad-${Date.now()}`,
      description: 'page is not part of SearchParameters',
      savedSearchType: 'User',
      searchParameters: { query: 'pw-api', page: 0, pageSize: 10 },
    },
  });
  const invalidStatus = invalid.status();
  if (invalidStatus === 200) {
    const leakedId = await invalid.json();
    await request.delete(`/SavedSearch/${leakedId}`, { headers: jsonHeaders() });
    expect(invalidStatus, 'page и pageSize нельзя передавать внутри searchParameters').toBe(400);
  } else {
    await expectStatus(invalid, 400);
  }

  let savedSearchId: number | undefined;
  try {
    const created = await request.post('/SavedSearch', {
      headers: jsonHeaders(),
      data: {
        name: `pw-api-search-${Date.now()}`,
        description: 'playwright own saved search',
        savedSearchType: 'User',
        searchParameters: { query: 'pw-api' },
      },
    });
    await expectStatus(created, 200);
    savedSearchId = await created.json();
    expect(typeof savedSearchId).toBe('number');

    const found = await request.post('/Asset/Search/BySavedSearchId', {
      headers: jsonHeaders(),
      data: { savedSearchId, pageSize: 10, lastSortValues: [] },
    });
    await expectStatus(found, 200);
    const body = await found.json();
    expect(typeof body.totalHits).toBe('number');
    expect(Array.isArray(body.assets)).toBe(true);
    expect(body).toHaveProperty('lastSortValues');
  } finally {
    if (savedSearchId) {
      const deleted = await request.delete(`/SavedSearch/${savedSearchId}`, { headers: jsonHeaders() });
      expect([204, 404]).toContain(deleted.status());
    }
  }
});
