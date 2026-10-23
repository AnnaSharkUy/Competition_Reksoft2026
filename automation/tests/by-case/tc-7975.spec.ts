import { test } from '@playwright/test';

/*
Frontier Id: 7975
Area: API/Lifecycle
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: HTTP 200; каждый элемент содержит name, statusColor, allowedActions
Step 0: GET {{API_BASE}}/LifeCycle/Status
  expect: HTTP 200
Step 1: Для каждого статуса проверить наличие name, statusColor, allowedActions
  expect: Все три поля присутствуют у каждого элемента
Импорт в Frontier: testcases-import/7975.json
*/

test('7975 API-LC-01 LifeCycle/Status с statusColor', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
