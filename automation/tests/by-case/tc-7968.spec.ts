import { test } from '@playwright/test';

/*
Frontier Id: 7968
Area: API/Comment
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: HTTP 400
Step 0: POST {{API_BASE}}/Comment без content (прочие поля допустимо заполнить)
  expect: HTTP 400
Импорт в Frontier: testcases-import/7968.json
*/

test('7968 API-NEG-09 Comment без content — 400', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
