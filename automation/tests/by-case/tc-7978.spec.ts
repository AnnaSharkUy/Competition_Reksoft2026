import { test } from '@playwright/test';

/*
Frontier Id: 7978
Area: API/Asset/Download
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer CanDownload; live assetId
Expected: HTTP 200 архив
Step 0: POST /Asset/Archive {"timestamp":"{{iso_timestamp}}","assetIds":[{{liveAssetId}}]}
  expect: HTTP 200
Импорт в Frontier: testcases-import/7978.json
*/

test('7978 API-AST-ARCH-01 Archive', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
