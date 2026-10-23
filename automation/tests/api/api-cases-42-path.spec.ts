import { test, expect, APIRequestContext } from '@playwright/test';
import { apiAuthHeaders, hasApiAuth } from '../../src/env';
import {
  TINY_JPEG,
  TINY_PDF,
  creationProcessName,
  deleteOwnAsset,
  listOf,
  numericId,
  readJson,
} from './openapi-support';

/**
 * API_Test_Cases_42.json — критический путь и CRUD, которые зависят от своего актива.
 * Пользователей и роли не меняет. Удаляет только активы, созданные этим файлом.
 * Имена уникальны на прогон: буквальные DBG_* из ручных кейсов иначе сталкиваются на стенде.
 */
test.describe.configure({ mode: 'serial' });

type CategoryNode = { id?: number; name?: string; isEnabled?: boolean; children?: CategoryNode[]; fields?: FieldNode[] };
type FieldNode = {
  id?: number;
  categoryId?: number;
  type?: string;
  disabledManualEditing?: boolean;
};

const state: {
  stamp: number;
  imageName: string;
  pdfName: string;
  renamed: string;
  assetId?: number;
  assetId2?: number;
  bpAssetId?: number;
  fileName?: string;
  processName?: string;
  categoryId?: number;
  fieldId?: number;
  versionV1Id?: number;
  versionsBefore?: number;
  v1Name?: string;
  v1FileName?: string;
  deleted?: boolean;
} = {
  stamp: Date.now(),
  imageName: '',
  pdfName: '',
  renamed: '',
};

function auth() {
  return apiAuthHeaders();
}

async function upload(
  request: APIRequestContext,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<number> {
  const multipart: Record<string, unknown> = {
    file: { name: fileName, mimeType, buffer },
  };
  if (state.processName) multipart.processName = state.processName;
  const response = await request.post('/Asset', { headers: auth(), multipart });
  const assetId = await readJson<number>(response, 200);
  expect(typeof assetId).toBe('number');
  expect(assetId).toBeGreaterThan(0);
  return assetId;
}

function walkCategories(nodes: CategoryNode[]): CategoryNode[] {
  const out: CategoryNode[] = [];
  for (const node of nodes) {
    out.push(node);
    if (Array.isArray(node.children)) out.push(...walkCategories(node.children));
  }
  return out;
}

test.describe('API_Test_Cases_42 critical path', () => {
  test.skip(!hasApiAuth(), 'Нужен DAM_TOKEN или DAM_API_KEY в automation/.env');
  test.setTimeout(180_000);

  test.beforeAll(() => {
    state.imageName = `pw-qa-image-${state.stamp}.jpg`;
    state.pdfName = `pw-qa-document-${state.stamp}.pdf`;
    state.renamed = `DBG_CP_RENAMED_${state.stamp}`;
  });

  test.afterAll(async ({ request }) => {
    if (!state.deleted) await deleteOwnAsset(request, state.assetId);
    await deleteOwnAsset(request, state.assetId2);
    await deleteOwnAsset(request, state.bpAssetId);
  });

  test('API-CP-02 SystemSettings и CreationProcesses', async ({ request }) => {
    const settings = await readJson<Record<string, unknown>>(
      await request.get('/SystemSettings', { headers: auth() }),
      200,
    );
    expect(typeof settings.isDocumentTextSearchEnabled).toBe('boolean');

    const processes = await readJson<unknown>(
      await request.get('/SystemSettings/CreationProcesses', { headers: auth() }),
      200,
    );
    expect(Array.isArray(processes)).toBe(true);
    state.processName = await creationProcessName(request);
    if (listOf(processes).length > 0) {
      expect(state.processName, 'processName берётся из поля name').toBeTruthy();
    }
  });

  test('API-CP-03 Создание image-актива POST /Asset', async ({ request }) => {
    state.assetId = await upload(request, state.imageName, 'image/jpeg', TINY_JPEG);
  });

  test('API-CP-04 GET актива после создания', async ({ request }) => {
    expect(state.assetId).toBeGreaterThan(0);
    const asset = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(asset.id).toBe(state.assetId);
    expect(typeof asset.fileName).toBe('string');
    expect(String(asset.fileName).length).toBeGreaterThan(0);
    state.fileName = String(asset.fileName);
  });

  test('API-CP-05 Thumbnail image-актива — 200', async ({ request }) => {
    expect(state.assetId && state.fileName).toBeTruthy();
    const deadline = Date.now() + 60_000;
    let lastStatus = 0;
    while (Date.now() < deadline) {
      const response = await request.get(
        `/Asset/Thumbnail/${state.assetId}/${encodeURIComponent(state.fileName!)}`,
        { headers: auth() },
      );
      lastStatus = response.status();
      if (lastStatus === 200) {
        expect((await response.body()).length).toBeGreaterThan(0);
        return;
      }
      expect(lastStatus, 'Повторять только 404, пока превью генерируется').toBe(404);
      await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
    throw new Error(`timeout 60s thumbnail, last status ${lastStatus}`);
  });

  test('API-CP-06 Download image-файла — 200', async ({ request }) => {
    const response = await request.get(
      `/Asset/${state.assetId}/${encodeURIComponent(state.fileName!)}`,
      { headers: auth() },
    );
    expect(response.status()).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(0);
  });

  test('API-CP-07 PATCH Name и проверка GET', async ({ request }) => {
    const patched = await request.patch('/Asset/Name', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: { assetId: state.assetId, name: state.renamed },
    });
    expect(patched.status(), await patched.text()).toBe(204);
    const asset = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(asset.name).toBe(state.renamed);
  });

  test('API-CP-08 PATCH Categories и проверка GET', async ({ request }) => {
    const library = await readJson<CategoryNode[]>(
      await request.get('/Taxonomy/Category/Library', { headers: auth() }),
      200,
    );
    const enabled = walkCategories(library).find((item) => typeof item.id === 'number' && item.isEnabled !== false);
    expect(enabled?.id, 'Нужна числовая категория из Library').toEqual(expect.any(Number));
    state.categoryId = enabled!.id;
    const patched = await request.patch('/Asset/Categories', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: { assetId: state.assetId, categories: [state.categoryId] },
    });
    expect(patched.status(), await patched.text()).toBe(204);
    const asset = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(asset.categories).toContain(state.categoryId);
  });

  test('API-CP-09 PATCH Categories/Fields (текстовое поле категории)', async ({ request }) => {
    const tree = await readJson<CategoryNode[]>(
      await request.get(`/Taxonomy/Category/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    const field = walkCategories(tree)
      .flatMap((node) => node.fields ?? [])
      .find((item) => item.type === 'Text' && item.disabledManualEditing !== true && typeof item.id === 'number');
    test.skip(!field, 'На стенде нет редактируемого Text-поля у категорий этого актива');
    state.fieldId = field!.id;
    const patched = await request.patch('/Asset/Categories/Fields', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: { assetId: state.assetId, updateFields: [{ fieldId: state.fieldId, fieldValue: ['DBG_FIELD_CP'] }] },
    });
    expect(patched.status(), await patched.text()).toBe(204);
    const asset = await readJson<{ fields?: { id?: number; value?: string[] }[] }>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    const saved = (asset.fields ?? []).find((item) => item.id === state.fieldId);
    expect(saved?.value ?? []).toContain('DBG_FIELD_CP');
  });

  test('API-CP-10 PATCH Tags и проверка GET', async ({ request }) => {
    const patched = await request.patch('/Asset/Tags', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: { assetId: state.assetId, tags: ['api_cp', 'critical'] },
    });
    expect(patched.status(), await patched.text()).toBe(204);
    const asset = await readJson<{ tags?: { tagValue?: string }[] }>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    const values = (asset.tags ?? []).map((tag) => tag.tagValue);
    expect(values).toEqual(expect.arrayContaining(['api_cp', 'critical']));
  });

  test('API-CP-11 Search созданного актива', async ({ request }) => {
    const deadline = Date.now() + 30_000;
    let last = '';
    while (Date.now() < deadline) {
      const body = await readJson<{ totalHits?: number; assets?: { id?: number }[] }>(
        await request.post('/Asset/Search', {
          headers: { ...auth(), 'Content-Type': 'application/json' },
          data: { query: state.renamed, page: 0, pageSize: 20 },
        }),
        200,
      );
      if ((body.totalHits ?? 0) >= 1 && (body.assets ?? []).some((item) => item.id === state.assetId)) return;
      last = `totalHits=${body.totalHits ?? 'missing'}`;
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    throw new Error(`index timeout 30s: ${last}`);
  });

  test('API-CP-12 GET Versions до ReplaceFile', async ({ request }) => {
    const versions = await readJson<{ id: number; versionNumber: number }[]>(
      await request.get(`/Asset/${state.assetId}/Versions`, { headers: auth() }),
      200,
    );
    expect(versions.length).toBeGreaterThan(0);
    state.versionsBefore = versions.length;
    const first = [...versions].sort((a, b) => a.versionNumber - b.versionNumber)[0];
    state.versionV1Id = first.id;
    const version = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/Version/${state.versionV1Id}`, { headers: auth() }),
      200,
    );
    state.v1Name = String(version.name ?? '');
    state.v1FileName = String(version.fileName ?? '');
    expect(state.v1FileName.length).toBeGreaterThan(0);
  });

  test('API-CP-13 ReplaceFile на PDF и обновление fileName', async ({ request }) => {
    const replaced = await request.post(`/Asset/${state.assetId}/ReplaceFile`, {
      headers: auth(),
      multipart: { file: { name: state.pdfName, mimeType: 'application/pdf', buffer: TINY_PDF } },
    });
    expect(replaced.status(), await replaced.text()).toBe(204);
    const versions = await readJson<unknown[]>(
      await request.get(`/Asset/${state.assetId}/Versions`, { headers: auth() }),
      200,
    );
    expect(versions.length).toBe((state.versionsBefore ?? 0) + 1);
    const asset = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    state.fileName = String(asset.fileName);
    expect(state.fileName.toLowerCase()).toContain('.pdf');
  });

  test('API-CP-14 Download после ReplaceFile — актуальный fileName', async ({ request }) => {
    const response = await request.get(
      `/Asset/${state.assetId}/${encodeURIComponent(state.fileName!)}`,
      { headers: auth() },
    );
    expect(response.status()).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(0);
  });

  test('API-CP-15 RestoreVersion', async ({ request }) => {
    const restored = await readJson<{ assetVersionId?: number }>(
      await request.post(`/Asset/RestoreVersion/${state.versionV1Id}`, { headers: auth() }),
      200,
    );
    expect(typeof restored.assetVersionId).toBe('number');
    const asset = await readJson<Record<string, unknown>>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(asset.name).toBe(state.v1Name);
    expect(asset.fileName).toBe(state.v1FileName);
    state.fileName = String(asset.fileName);
  });

  test('API-COL-01 CRUD коллекции; актив остаётся', async ({ request }) => {
    const name = `DBG_COL_CP_${state.stamp}`;
    const collectionId = await readJson<number>(
      await request.post('/Collection', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { name },
      }),
      200,
    );
    expect(typeof collectionId).toBe('number');
    try {
      const renamed = await request.patch('/Collection/Name', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { id: collectionId, name: `DBG_COL_RENAMED_${state.stamp}` },
      });
      expect(renamed.status(), await renamed.text()).toBe(204);
      const added = await request.post('/Collection/Assets', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { id: collectionId, assetIds: [state.assetId] },
      });
      expect(added.status(), await added.text()).toBe(204);
      const collection = await readJson<{ assetIds?: number[] }>(
        await request.get(`/Collection/${collectionId}`, { headers: auth() }),
        200,
      );
      expect(collection.assetIds).toContain(state.assetId);
      const removed = await request.delete(`/Collection/${collectionId}`, { headers: auth() });
      expect(removed.status(), await removed.text()).toBe(204);
      const asset = await request.get(`/Asset/${state.assetId}`, { headers: auth() });
      expect(asset.status()).toBe(200);
    } finally {
      await request.delete(`/Collection/${collectionId}`, { headers: auth() });
    }
  });

  test('API-CMT-01 CRUD комментария с проверкой deletedAt', async ({ request }) => {
    const content = `DBG_CMT_${state.stamp}`;
    const edited = `DBG_CMT_EDITED_${state.stamp}`;
    const created = await readJson<{ id?: number }>(
      await request.post('/Comment', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: {
          targetId: state.assetId,
          targetSection: 'Asset',
          targetSectionId: state.assetId,
          content,
          assetName: state.renamed,
          assetLink: 'https://dam.rex.lab.reksoft.com/Library',
        },
      }),
      200,
    );
    expect(typeof created.id).toBe('number');
    const listed = await readJson<{ content?: string; id?: number }[]>(
      await request.get(`/Comment/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(listed.some((item) => item.content === content)).toBe(true);
    const updated = await readJson<{ content?: string }>(
      await request.put('/Comment', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { targetId: state.assetId, id: created.id, content: edited },
      }),
      200,
    );
    expect(updated.content).toBe(edited);
    const deleted = await readJson<{ deletedAt?: string | null; content?: string }>(
      await request.delete(`/Comment/${state.assetId}/${created.id}`, { headers: auth() }),
      200,
    );
    const after = await readJson<{ id?: number; deletedAt?: string | null; content?: string }[]>(
      await request.get(`/Comment/${state.assetId}`, { headers: auth() }),
      200,
    );
    const row = after.find((item) => item.id === created.id) ?? deleted;
    const hidden = Boolean(row.deletedAt) || row.content !== edited;
    expect(hidden, 'deletedAt заполнен или текст скрыт').toBe(true);
  });

  test('API-LNK-01 CRUD связи; DELETE с обёрткой links', async ({ request }) => {
    state.assetId2 = await upload(request, `pw-qa-link-${state.stamp}.jpg`, 'image/jpeg', TINY_JPEG);
    const types = await readJson<unknown>(await request.get('/Taxonomy/LinkType', { headers: auth() }), 200);
    const linkTypeId = numericId(listOf(types)[0], ['id', 'linkTypeId']);
    expect(linkTypeId, 'Нужен числовой linkTypeId').toEqual(expect.any(Number));
    const created = await request.post('/AssetLink', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: {
        assetId: state.assetId,
        assetsToLinkIds: [state.assetId2],
        linkTypeId,
        isLinkFromParentToChild: true,
      },
    });
    expect(created.status(), await created.text()).toBe(204);
    const linked = await readJson<{ asset?: { id?: number } }[]>(
      await request.get(`/AssetLink/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(linked.some((item) => item.asset?.id === state.assetId2)).toBe(true);
    const removed = await request.delete('/AssetLink', {
      headers: { ...auth(), 'Content-Type': 'application/json' },
      data: { links: [{ asset1Id: state.assetId, asset2Id: state.assetId2, linkTypeId }] },
    });
    expect(removed.status(), await removed.text()).toBe(204);
    const after = await readJson<{ asset?: { id?: number } }[]>(
      await request.get(`/AssetLink/${state.assetId}`, { headers: auth() }),
      200,
    );
    expect(after.some((item) => item.asset?.id === state.assetId2)).toBe(false);
    await deleteOwnAsset(request, state.assetId2);
    state.assetId2 = undefined;
  });

  test('API-SS-01 CRUD SavedSearch User', async ({ request }) => {
    const savedSearchId = await readJson<number>(
      await request.post('/SavedSearch', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: {
          name: `DBG_SS_${state.stamp}`,
          description: 'cp',
          savedSearchType: 'User',
          searchParameters: { query: 'DBG' },
        },
      }),
      200,
    );
    expect(typeof savedSearchId).toBe('number');
    try {
      const saved = await readJson<{ type?: string }>(
        await request.get(`/SavedSearch/${savedSearchId}`, { headers: auth() }),
        200,
      );
      expect(saved.type).toBe('User');
      const renamed = await request.put('/SavedSearch', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { id: savedSearchId, name: `DBG_SS2_${state.stamp}`, description: 'cp2' },
      });
      expect(renamed.status(), await renamed.text()).toBe(204);
      const params = await request.put('/SavedSearch/SearchParameters', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { id: savedSearchId, searchParameters: { query: 'DBG2' } },
      });
      expect(params.status(), await params.text()).toBe(204);
    } finally {
      const deleted = await request.delete(`/SavedSearch/${savedSearchId}`, { headers: auth() });
      expect([204, 404]).toContain(deleted.status());
    }
    const list = await readJson<{ id?: number }[]>(
      await request.get('/SavedSearch/User', { headers: auth() }),
      200,
    );
    expect(list.some((item) => item.id === savedSearchId)).toBe(false);
  });

  test('API-CP-16 BusinessAction на отдельном активе + History', async ({ request }) => {
    state.bpAssetId = await upload(request, `pw-qa-bp-${state.stamp}.jpg`, 'image/jpeg', TINY_JPEG);
    const asset = await readJson<{ allowedActions?: { id?: number }[] }>(
      await request.get(`/Asset/${state.bpAssetId}`, { headers: auth() }),
      200,
    );
    const actionId = asset.allowedActions?.find((action) => typeof action.id === 'number')?.id;
    expect(actionId, 'Нет allowedActions у своего актива').toEqual(expect.any(Number));
    const performed = await readJson<{ historyRecordId?: number }>(
      await request.post('/Asset/BusinessAction', {
        headers: { ...auth(), 'Content-Type': 'application/json' },
        data: { assetId: state.bpAssetId, actionId },
      }),
      200,
    );
    expect(typeof performed.historyRecordId).toBe('number');
    const history = await readJson<{ id?: number }[]>(
      await request.get(`/Asset/${state.bpAssetId}/BusinessActionHistory`, { headers: auth() }),
      200,
    );
    expect(history.some((row) => row.id === performed.historyRecordId)).toBe(true);
    const cleanup = await request.delete(`/Asset/${state.bpAssetId}`, { headers: auth() });
    expect(
      cleanup.status(),
      'Cleanup не 204: action снял право delete. Не перезапускать тот же кейс, создать новый bpAssetId и другой actionId.',
    ).toBe(204);
    state.bpAssetId = undefined;
  });

  test('API-CP-17 DELETE актива — 204', async ({ request }) => {
    const deleted = await request.delete(`/Asset/${state.assetId}`, { headers: auth() });
    expect(deleted.status(), await deleted.text()).toBe(204);
    state.deleted = true;
  });

  test('API-CP-18 GET удалённого актива — 404', async ({ request }) => {
    test.skip(!state.deleted, 'CP-17 не удалил свой актив');
    const missing = await readJson<{ message?: string }>(
      await request.get(`/Asset/${state.assetId}`, { headers: auth() }),
      404,
    );
    expect(missing.message?.length).toBeGreaterThan(0);
  });
});
