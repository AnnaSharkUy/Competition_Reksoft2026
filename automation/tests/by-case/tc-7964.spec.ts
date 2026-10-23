import { test } from '@playwright/test';

/*
Frontier Id: 7964
Area: API/Asset/Preview
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; актив/fileName без thumbnail
Expected: HTTP 404
Step 0: GET {{API_BASE}}/Asset/Thumbnail/{{assetIdNoPreview}}/{{fileName}}
  expect: HTTP 404
Импорт в Frontier: testcases-import/7964.json
*/

test('7964 API-NEG-05 Thumbnail без превью — 404', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
