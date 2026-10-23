import { test } from '@playwright/test';

/*
Frontier Id: 7961
Area: API/Auth
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Реальный токен не нужен. {{INVALID_BEARER}}=not.a.jwt.token (любая невалидная строка)
Expected: HTTP 401
Step 0: GET {{API_BASE}}/SystemSettings заголовок Authorization: Bearer {{INVALID_BEARER}}
  expect: HTTP 401
Импорт в Frontier: testcases-import/7961.json
*/

test('7961 API-NEG-02 Невалидный Bearer — 401', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
