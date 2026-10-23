import { test } from '@playwright/test';

/*
Frontier Id: 7954
Area: API/AssetLink
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}; второй {{assetId2}} (создать отдельным POST /Asset или взять существующий); {{linkTypeId}} из GET /Taxonomy/LinkType
Expected: POST 204; GET показывает связь; DELETE 204; GET без этой связи
Step 0: При необходимости POST /Asset для {{assetId2}} (второй актив)
  expect: {{assetId2}} — integer
Step 1: GET {{API_BASE}}/Taxonomy/LinkType → {{linkTypeId}} integer
  expect: {{linkTypeId}} получен
Step 2: POST {{API_BASE}}/AssetLink {"assetId":{{assetId}},"assetsToLinkIds":[{{assetId2}}],"linkTypeId":{{linkTypeId}},"isLinkFromParentToChild":true}
  expect: HTTP 204
Step 3: GET {{API_BASE}}/AssetLink/{{assetId}}
  expect: HTTP 200; связь с {{assetId2}} есть
Step 4: DELETE {{API_BASE}}/AssetLink тело: {"links":[{"asset1Id":{{assetId}},"asset2Id":{{assetId2}},"linkTypeId":{{linkTypeId}}}]}
  expect: HTTP 204
Step 5: GET {{API_BASE}}/AssetLink/{{assetId}}
  expect: HTTP 200; удалённой связи нет
Импорт в Frontier: testcases-import/7954.json
*/

test('7954 API-LNK-01 CRUD связи; DELETE с обёрткой links', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
