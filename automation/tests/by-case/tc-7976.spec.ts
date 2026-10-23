import { test } from '@playwright/test';

/*
Frontier Id: 7976
Area: API/User
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; существующий userId
Expected: HTTP 200 UserView
Step 0: GET {{API_BASE}}/User/{{existingUserId}}
  expect: HTTP 200
Импорт в Frontier: testcases-import/7976.json
*/

test('7976 API-USR-01 GET User существующий — 200', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
