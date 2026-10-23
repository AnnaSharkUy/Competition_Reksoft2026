import { test } from '@playwright/test';

/*
Frontier Id: 7969
Area: API/Taxonomy
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: HTTP 404
Step 0: GET {{API_BASE}}/Taxonomy/ValueSource/{{nonexistentValueSourceId}}
  expect: HTTP 404
Импорт в Frontier: testcases-import/7969.json
*/

test('7969 API-NEG-10 ValueSource несуществующий — 404', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
