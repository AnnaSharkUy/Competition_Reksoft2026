import { test } from '@playwright/test';

/*
Frontier Id: 7957
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}} существует; текущий статус основного актива и права пользователя допускают удаление. Не зависит от CP-16: CP-16 работает с отдельным {{bpAssetId}} и не меняет статус {{assetId}}
Expected: HTTP 204
Step 0: DELETE {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 204 No Content
Импорт в Frontier: testcases-import/7957.json
*/

test('7957 API-CP-17 DELETE актива — 204', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
