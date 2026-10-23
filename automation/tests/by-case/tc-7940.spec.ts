import { test } from '@playwright/test';

/*
Frontier Id: 7940
Area: API/Critical Path/Asset
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; {{assetId}} из CP-03
Expected: HTTP 200 AssetResponse; id актива == {{assetId}}; сохранены {{fileName}} и при наличии {{assetVersionId}} текущей версии
Step 0: GET {{API_BASE}}/Asset/{{assetId}}
  expect: HTTP 200
Step 1: Сверить id с {{assetId}}; сохранить fileName текущей версии как {{fileName}}
  expect: id совпадает; {{fileName}} непустой (например qa-image.jpg)
Импорт в Frontier: testcases-import/7940.json
*/

test('7940 API-CP-04 GET актива после создания', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
