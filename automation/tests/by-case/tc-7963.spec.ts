import { test } from '@playwright/test';

/*
Frontier Id: 7963
Area: API/Asset/Download
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer CanDownload; валидный assetId живого актива; fileName=not_exists.bin
Expected: HTTP 404
Step 0: GET {{API_BASE}}/Asset/{{liveAssetId}}/not_exists.bin
  expect: HTTP 404
Импорт в Frontier: testcases-import/7963.json
*/

test('7963 API-NEG-04 Download несуществующий fileName — 404', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
