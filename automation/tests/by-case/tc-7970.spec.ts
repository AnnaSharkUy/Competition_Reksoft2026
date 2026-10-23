import { test } from '@playwright/test';

/*
Frontier Id: 7970
Area: API/User
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: HTTP 400
Step 0: GET {{API_BASE}}/User/{{unknownUserId}}
  expect: HTTP 400
Импорт в Frontier: testcases-import/7970.json
*/

test('7970 API-NEG-11 User неизвестный — 400', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
