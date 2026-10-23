import { test } from '@playwright/test';

/*
Frontier Id: 7972
Area: API/Asset/Search
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer с правом edit; известен editable asset (создать/использовать {{liveAssetId}})
Expected: HTTP 200; totalHits≥1; у каждого элемента assets canEdit == true
Step 0: POST {{API_BASE}}/Asset/Search/Editable с фильтром assetIds по {{liveAssetId}} или query уникального имени
  expect: HTTP 200
Step 1: Для каждого элемента assets проверить canEdit === true
  expect: totalHits≥1; у всех элементов canEdit == true
Импорт в Frontier: testcases-import/7972.json
*/

test('7972 API-AST-SEARCH-EDIT-01 Search/Editable canEdit', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
