import { test } from '@playwright/test';

/*
Frontier Id: 7967
Area: API/Collection
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: HTTP 400
Step 0: POST {{API_BASE}}/Collection {}
  expect: HTTP 400
Импорт в Frontier: testcases-import/7967.json
*/

test('7967 API-NEG-08 Collection без name — 400', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
