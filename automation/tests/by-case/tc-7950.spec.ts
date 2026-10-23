import { test } from '@playwright/test';

/*
Frontier Id: 7950
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer CanDownload; {{assetId}}; {{fileName}} обновлён в CP-13
Expected: HTTP 200; поток файла текущей (PDF) версии
Step 0: GET {{API_BASE}}/Asset/{{assetId}}/{{fileName}}
  expect: HTTP 200
Импорт в Frontier: testcases-import/7950.json
*/

test('7950 API-CP-14 Download после ReplaceFile — актуальный fileName', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
