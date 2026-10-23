import { test } from '@playwright/test';

/*
Frontier Id: 7951
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{versionV1Id}} с min(versionNumber) из CP-12; снимки {{v1Name}}, {{v1FileName}}
Expected: HTTP 200; assetVersionId в ответе — number; GET Asset: name=={{v1Name}}, fileName=={{v1FileName}}
Step 0: POST {{API_BASE}}/Asset/RestoreVersion/{{versionV1Id}}
  expect: HTTP 200
Step 1: Проверить тело RestoreAssetVersionResponse: поле assetVersionId — число
  expect: assetVersionId присутствует и typeof number / integer
Step 2: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200; name == {{v1Name}}; fileName == {{v1FileName}}
Импорт в Frontier: testcases-import/7951.json
*/

test('7951 API-CP-15 RestoreVersion', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
