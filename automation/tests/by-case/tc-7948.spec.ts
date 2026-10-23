import { test } from '@playwright/test';

/*
Frontier Id: 7948
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}}
Expected: HTTP 200; {{versionsBefore}}=length; {{versionV1Id}}=id с min(versionNumber); {{v1Name}}, {{v1FileName}} из GET Version
Step 0: GET {{API_BASE}}/Asset/{{assetId}}/Versions
  expect: HTTP 200; непустой массив AssetVersionView
Step 1: Выбрать элемент с минимальным versionNumber; сохранить id как {{versionV1Id}}; {{versionsBefore}}=length
  expect: {{versionV1Id}} = id версии с min(versionNumber); {{versionsBefore}}≥1
Step 2: GET {{API_BASE}}/Asset/Version/{{versionV1Id}}; сохранить name→{{v1Name}}, fileName→{{v1FileName}}
  expect: HTTP 200; {{v1Name}} и {{v1FileName}} зафиксированы
Импорт в Frontier: testcases-import/7948.json
*/

test('7948 API-CP-12 GET Versions до ReplaceFile', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
