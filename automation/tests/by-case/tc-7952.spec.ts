import { test } from '@playwright/test';

/*
Frontier Id: 7952
Area: API/Collection
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}} ещё не удалён (до CP-DEL)
Expected: collectionId получен; rename 204; add 204; delete collection 204; GET /Asset/{{assetId}} → 200
Step 0: POST {{API_BASE}}/Collection {"name":"DBG_COL_CP"}
  expect: HTTP 200; body integer {{collectionId}}
Step 1: PATCH {{API_BASE}}/Collection/Name {"id":{{collectionId}},"name":"DBG_COL_RENAMED"}
  expect: HTTP 204
Step 2: POST {{API_BASE}}/Collection/Assets {"id":{{collectionId}},"assetIds":[{{assetId}}]}  // assetId number в массиве
  expect: HTTP 204
Step 3: GET {{API_BASE}}/Collection/{{collectionId}}
  expect: HTTP 200; assetIds содержит {{assetId}}
Step 4: DELETE {{API_BASE}}/Collection/{{collectionId}}  // актив всё ещё в коллекции
  expect: HTTP 204
Step 5: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200; актив не удалён вместе с коллекцией
Импорт в Frontier: testcases-import/7952.json
*/

test('7952 API-COL-01 CRUD коллекции; актив остаётся в коллекции до delete collection', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
