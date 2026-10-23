import { test } from '@playwright/test';

/*
Frontier Id: 7943
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}
Expected: HTTP 204; GET name == DBG_CP_RENAMED
Step 0: PATCH {{API_BASE}}/Asset/Name тело: {"assetId":{{assetId}},"name":"DBG_CP_RENAMED"}  // assetId без кавычек
  expect: HTTP 204 No Content
Step 1: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200; name == DBG_CP_RENAMED
Импорт в Frontier: testcases-import/7943.json
*/

test('7943 API-CP-07 PATCH Name и проверка GET', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
