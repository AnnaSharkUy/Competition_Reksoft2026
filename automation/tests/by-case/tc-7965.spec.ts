import { test } from '@playwright/test';

/*
Frontier Id: 7965
Area: API/Asset/Update
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{liveAssetId}} integer
Expected: HTTP 400; ErrorResponse
Step 0: PATCH {{API_BASE}}/Asset/Name {"assetId":{{liveAssetId}}}
  expect: HTTP 400
Импорт в Frontier: testcases-import/7965.json
*/

test('7965 API-NEG-06 PATCH Name без name — 400', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
