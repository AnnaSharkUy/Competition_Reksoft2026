import { test } from '@playwright/test';

/*
Frontier Id: 7971
Area: API/Exploratory
Priority: Low Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: Ответ получен; status ≠ 500; фактический code и body записаны в отчёт (ожидаемо 400 на стенде, но не контракт schema required)
Step 0: POST {{API_BASE}}/Asset multipart без part file
  expect: status зафиксирован; не 500
Импорт в Frontier: testcases-import/7971.json
*/

test('7971 API-EXP-01 POST /Asset без file — поведение стенда', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
