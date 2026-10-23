import { test } from '@playwright/test';

/*
Frontier Id: 7959
Area: API/Auth
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: {{VALID_API_KEY}} выдан стендом; заголовок X-Api-Key; без Authorization
Expected: HTTP 200; тело DamSystemSettingsResponse
Step 0: GET {{API_BASE}}/SystemSettings с заголовком X-Api-Key: {{VALID_API_KEY}}, без Authorization
  expect: HTTP 200; isDocumentTextSearchEnabled — boolean
Импорт в Frontier: testcases-import/7959.json
*/

test('7959 API-AUTH-01 SystemSettings с валидным X-Api-Key', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
