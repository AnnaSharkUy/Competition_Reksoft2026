import { test } from '@playwright/test';

/*
Frontier Id: 7949
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}; файл qa-document.pdf
Expected: HTTP 204; Versions length == versionsBefore+1; {{fileName}} обновлён до имени PDF
Step 0: POST {{API_BASE}}/Asset/{{assetId}}/ReplaceFile multipart file=qa-document.pdf
  expect: HTTP 204
Step 1: GET {{API_BASE}}/Asset/{{assetId}}/Versions
  expect: HTTP 200; length == {{versionsBefore}}+1
Step 2: GET {{API_BASE}}/Asset/{{assetId}}; сохранить новый fileName как {{fileName}}
  expect: {{fileName}} соответствует qa-document.pdf (или фактическому basename загрузки)
Импорт в Frontier: testcases-import/7949.json
*/

test('7949 API-CP-13 ReplaceFile на PDF и обновление fileName', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
