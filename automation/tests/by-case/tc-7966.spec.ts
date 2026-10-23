import { test } from '@playwright/test';

/*
Frontier Id: 7966
Area: API/Asset/Process
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; live assetId
Expected: HTTP 400
Step 0: POST {{API_BASE}}/Asset/BusinessAction {"assetId":{{liveAssetId}}}
  expect: HTTP 400
Импорт в Frontier: testcases-import/7966.json
*/

test('7966 API-NEG-07 BusinessAction без actionId — 400', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
