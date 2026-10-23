import { test } from '@playwright/test';

/*
Frontier Id: 7938
Area: API/Critical Path
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Authorization: Bearer {{access_token}}
Expected: HTTP 200 на оба GET; isDocumentTextSearchEnabled — boolean; при непустом списке процессов {{processName}} = name первого/выбранного элемента
Step 0: GET {{API_BASE}}/SystemSettings
  expect: HTTP 200; isDocumentTextSearchEnabled имеет тип boolean
Step 1: GET {{API_BASE}}/SystemSettings/CreationProcesses
  expect: HTTP 200; тело — JSON-массив объектов
Step 2: Если массив не пуст: сохранить processName = elements[i].name как {{processName}}
  expect: {{processName}} равен полю name объекта процесса (строка), не displayName
Импорт в Frontier: testcases-import/7938.json
*/

test('7938 API-CP-02 SystemSettings и CreationProcesses', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
