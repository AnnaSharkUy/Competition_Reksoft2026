import { test } from '@playwright/test';

/*
Frontier Id: 7946
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}
Expected: HTTP 204; GET: в массиве tags есть элементы с tagValue == "api_cp" и tagValue == "critical"
Step 0: PATCH {{API_BASE}}/Asset/Tags {"assetId":{{assetId}},"tags":["api_cp","critical"]}
  expect: HTTP 204
Step 1: GET {{API_BASE}}/Asset/{{assetId}}; проверить tags[].tagValue
  expect: HTTP 200; среди tags[].tagValue присутствуют "api_cp" и "critical"
Импорт в Frontier: testcases-import/7946.json
*/

test('7946 API-CP-10 PATCH Tags и проверка GET', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
