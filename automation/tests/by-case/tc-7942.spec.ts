import { test } from '@playwright/test';

/*
Frontier Id: 7942
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer с CanDownload; {{assetId}}, {{fileName}} из CP-04
Expected: HTTP 200; поток исходного файла
Step 0: GET {{API_BASE}}/Asset/{{assetId}}/{{fileName}}
  expect: HTTP 200
Step 1: Убедиться, что ответ не ErrorResponse
  expect: Файловое/бинарное тело получено
Импорт в Frontier: testcases-import/7942.json
*/

test('7942 API-CP-06 Download image-файла — 200', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
