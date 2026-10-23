import { test } from '@playwright/test';

/*
Frontier Id: 7974
Area: API/Taxonomy
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: Все HTTP 200
Step 0: GET /Taxonomy/Category/Library
  expect: HTTP 200
Step 1: GET /Taxonomy/Field
  expect: HTTP 200
Step 2: GET /Taxonomy/LinkType
  expect: HTTP 200
Step 3: GET /Taxonomy/SystemField
  expect: HTTP 200
Step 4: GET /Taxonomy/UserCategories
  expect: HTTP 200
Импорт в Frontier: testcases-import/7974.json
*/

test('7974 API-TAX-01 Taxonomy read set', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
