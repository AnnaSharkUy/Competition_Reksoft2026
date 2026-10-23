import { test } from '@playwright/test';

/*
Frontier Id: 7958
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: {{assetId}} удалён в CP-17
Expected: HTTP 404; ErrorResponse.message непустой
Step 0: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 404
Step 1: Проверить message
  expect: message — непустая строка
Импорт в Frontier: testcases-import/7958.json
*/

test('7958 API-CP-18 GET удалённого актива — 404', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
