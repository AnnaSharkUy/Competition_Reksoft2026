import { test } from '@playwright/test';

/*
Frontier Id: 7939
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer {{access_token}}; файл fixtures/upload/qa-image.jpg; {{processName}} из CP-02 если список не пуст (иначе опустить processName)
Expected: HTTP 200; тело ответа — целое число (int64) {{assetId}} > 0
Step 0: POST {{API_BASE}}/Asset multipart/form-data: file=qa-image.jpg; processName={{processName}} если задан
  expect: HTTP 200
Step 1: Прочитать body как integer; сохранить {{assetId}} (число, без кавычек в дальнейших JSON)
  expect: {{assetId}} — integer > 0
Импорт в Frontier: testcases-import/7939.json
*/

test('7939 API-CP-03 Создание image-актива POST /Asset', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
