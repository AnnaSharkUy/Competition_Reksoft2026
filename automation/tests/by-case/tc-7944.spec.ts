import { test } from '@playwright/test';

/*
Frontier Id: 7944
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}; {{categoryId}} — number из GET /Taxonomy/Category/Library или UserCategories
Expected: HTTP 204; GET содержит {{categoryId}} в categories
Step 0: GET taxonomy; выбрать числовой {{categoryId}}
  expect: {{categoryId}} — integer
Step 1: PATCH {{API_BASE}}/Asset/Categories {"assetId":{{assetId}},"categories":[{{categoryId}}]}
  expect: HTTP 204
Step 2: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200; categories содержат {{categoryId}}
Импорт в Frontier: testcases-import/7944.json
*/

test('7944 API-CP-08 PATCH Categories и проверка GET', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
