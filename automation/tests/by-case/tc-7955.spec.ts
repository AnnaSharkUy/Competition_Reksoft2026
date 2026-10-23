import { test } from '@playwright/test';

/*
Frontier Id: 7955
Area: API/SavedSearch
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer
Expected: Create 200+integer id; GET 200; updates 204; DELETE 204; id нет в GET /SavedSearch/User
Step 0: POST /SavedSearch {"name":"DBG_SS","description":"cp","savedSearchType":"User","searchParameters":{"query":"DBG"}}
  expect: HTTP 200; {{savedSearchId}} integer
Step 1: GET /SavedSearch/{{savedSearchId}}
  expect: HTTP 200; type User
Step 2: PUT /SavedSearch {"id":{{savedSearchId}},"name":"DBG_SS2","description":"cp2"}
  expect: HTTP 204
Step 3: PUT /SavedSearch/SearchParameters {"id":{{savedSearchId}},"searchParameters":{"query":"DBG2"}}
  expect: HTTP 204
Step 4: DELETE /SavedSearch/{{savedSearchId}}
  expect: HTTP 204
Step 5: GET /SavedSearch/User
  expect: HTTP 200; {{savedSearchId}} отсутствует
Импорт в Frontier: testcases-import/7955.json
*/

test('7955 API-SS-01 CRUD SavedSearch User', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
