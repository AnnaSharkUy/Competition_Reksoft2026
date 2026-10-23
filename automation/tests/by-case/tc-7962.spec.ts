import { test } from '@playwright/test';

/*
Frontier Id: 7962
Area: API/Asset/Read
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; nonexistent numeric id
Expected: HTTP 404; ErrorResponse.message непустой
Step 0: GET {{API_BASE}}/Asset/{{nonexistentAssetId}}
  expect: HTTP 404
Step 1: Проверить message
  expect: message непустой
Импорт в Frontier: testcases-import/7962.json
*/

test('7962 API-NEG-03 GET Asset несуществующий id — 404', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
