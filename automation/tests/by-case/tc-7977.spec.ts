import { test } from '@playwright/test';

/*
Frontier Id: 7977
Area: API/AssetTag
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer или ApiKey
Expected: HTTP 200; array of string
Step 0: GET {{API_BASE}}/AssetTag
  expect: HTTP 200; JSON array строк
Импорт в Frontier: testcases-import/7977.json
*/

test('7977 API-TAG-01 GET AssetTag', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
