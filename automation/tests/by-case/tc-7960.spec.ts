import { test } from '@playwright/test';

/*
Frontier Id: 7960
Area: API/Auth
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Не передавать оба заголовка
Expected: HTTP 401
Step 0: GET {{API_BASE}}/SystemSettings без Authorization и X-Api-Key
  expect: HTTP 401
Импорт в Frontier: testcases-import/7960.json
*/

test('7960 API-NEG-01 Без Authorization и X-Api-Key — 401', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
