import { test } from '@playwright/test';

/*
Frontier Id: 7956
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; создать {{bpAssetId}} отдельным POST /Asset (тот же processName); {{actionId}} integer из allowedActions статуса {{bpAssetId}}; выбрать actionId так, чтобы после выполнения статус {{bpAssetId}} и роль текущего пользователя по-прежнему допускали DELETE (иначе cleanup оставит данные на стенде)
Expected: HTTP 200; historyRecordId — integer; в GET BusinessActionHistory есть запись с id == historyRecordId
Step 0: POST {{API_BASE}}/Asset multipart file=qa-image.jpg, processName={{processName}} → сохранить integer {{bpAssetId}}
  expect: HTTP 200; {{bpAssetId}} integer > 0
Step 1: GET {{API_BASE}}/Asset/{{bpAssetId}} или LifeCycle; выбрать {{actionId}} integer из allowedActions
  expect: {{actionId}} — integer
Step 2: POST {{API_BASE}}/Asset/BusinessAction {"assetId":{{bpAssetId}},"actionId":{{actionId}}}
  expect: HTTP 200
Step 3: Прочитать PerformBusinessActionResponse.historyRecordId → {{historyRecordId}}
  expect: {{historyRecordId}} — integer, не null
Step 4: GET {{API_BASE}}/Asset/{{bpAssetId}}/BusinessActionHistory
  expect: HTTP 200; в массиве есть элемент с id == {{historyRecordId}} (точное равенство)
Step 5: DELETE {{API_BASE}}/Asset/{{bpAssetId}} (cleanup отдельного актива). Если 403/400 — выбранный actionId перевёл актив в статус без права delete; повторить кейс с другим actionId из allowedActions исходного статуса
  expect: HTTP 204 (право delete сохранено после BusinessAction)
Импорт в Frontier: testcases-import/7956.json
*/

test('7956 API-CP-16 BusinessAction на отдельном активе + History по id', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
