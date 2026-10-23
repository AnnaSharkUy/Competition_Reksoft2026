import { test } from '@playwright/test';

/*
Frontier Id: 7941
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}} JPEG из CP-03; {{fileName}} из CP-04; poll: interval 3s, max wait 60s
Expected: HTTP 200; непустое binary-тело thumbnail
Step 0: Повторять GET {{API_BASE}}/Asset/Thumbnail/{{assetId}}/{{fileName}} каждые 3 с, не дольше 60 с, пока status не 200 или не истечёт таймаут
  expect: В пределах 60 с получен HTTP 200; иначе fail с причиной timeout 60s
Step 1: Проверить, что тело ответа непустое и не JSON ErrorResponse
  expect: Binary thumbnail получен
Импорт в Frontier: testcases-import/7941.json
*/

test('7941 API-CP-05 Thumbnail image-актива — 200', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
