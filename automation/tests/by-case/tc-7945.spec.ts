import { test } from '@playwright/test';

/*
Frontier Id: 7945
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}; {{fieldId}} — Text-поле из fields выбранной category; не disabledManualEditing
Expected: HTTP 204; GET: значение {{fieldId}} == DBG_FIELD_CP
Step 0: По GET /Taxonomy/Category/Asset/{{assetId}} или Field выбрать fieldId типа Text категории {{categoryId}}
  expect: {{fieldId}} integer, type Text, относится к категории актива
Step 1: PATCH {{API_BASE}}/Asset/Categories/Fields тело: {"assetId":{{assetId}},"updateFields":[{"fieldId":{{fieldId}},"fieldValue":["DBG_FIELD_CP"]}]}
  expect: HTTP 204
Step 2: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200; значение поля {{fieldId}} содержит DBG_FIELD_CP
Импорт в Frontier: testcases-import/7945.json
*/

test('7945 API-CP-09 PATCH Categories/Fields (текстовое поле категории)', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
