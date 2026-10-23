import { test } from '@playwright/test';

/*
Frontier Id: 7947
Area: API/Critical Path/Search
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; имя DBG_CP_RENAMED; {{assetId}}; индексация: poll interval 2s, max wait 30s
Expected: В пределах 30s: HTTP 200; totalHits≥1; в assets есть id == {{assetId}}
Step 0: Повторять POST {{API_BASE}}/Asset/Search {"query":"DBG_CP_RENAMED","page":0,"pageSize":20} каждые 2 с, не дольше 30 с, пока totalHits≥1 и assets содержат id={{assetId}} либо не истечёт таймаут
  expect: В пределах 30s найден assetId; иначе fail с причиной index timeout 30s
Импорт в Frontier: testcases-import/7947.json
*/

test('7947 API-CP-11 Search созданного актива', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
