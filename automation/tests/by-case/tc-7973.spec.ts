import { test } from '@playwright/test';

/*
Frontier Id: 7973
Area: API/Asset/Search
Priority: Medium Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; lastSortValues=[]; кейс самодостаточен — не использует {{savedSearchId}} из API-SS-01 (тот удаляется внутри SS-01)
Expected: Create SavedSearch 200 + integer id; BySavedSearchId HTTP 200; totalHits и assets присутствуют; cleanup DELETE 204
Step 0: POST /SavedSearch {"name":"DBG_SS_BYSEARCH","description":"for BySavedSearchId","savedSearchType":"User","searchParameters":{"query":"DBG"}}
  expect: HTTP 200; {{savedSearchIdForSearch}} integer
Step 1: POST /Asset/Search/BySavedSearchId {"savedSearchId":{{savedSearchIdForSearch}},"pageSize":20,"lastSortValues":[]}
  expect: HTTP 200; totalHits и assets присутствуют
Step 2: DELETE /SavedSearch/{{savedSearchIdForSearch}} (cleanup)
  expect: HTTP 204
Импорт в Frontier: testcases-import/7973.json
*/

test('7973 API-AST-SEARCH-SAVED-01 BySavedSearchId', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
