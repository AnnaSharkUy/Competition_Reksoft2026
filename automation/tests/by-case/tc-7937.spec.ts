import { test } from '@playwright/test';

/*
Frontier Id: 7937
Area: API/Critical Path/Auth
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-checks.spec.ts
Reason: уже есть исполняемый тест
Preconditions: {{TOKEN_URL}}, {{USERNAME}}, {{PASSWORD}}, {{CLIENT_SECRET}}; client_id=rex-client; grant_type=password
Expected: HTTP 200 от IdP; access_token — непустая строка; token_type указывает Bearer; expires_in > 0. Токен сохраняется как {{access_token}}.
Step 0: POST {{TOKEN_URL}} Content-Type: application/x-www-form-urlencoded
  expect: IdP принимает соединение и запрос
Step 1: Тело: grant_type=password&client_id=rex-client&client_secret={{CLIENT_SECRET}}&username={{USERNAME}}&password={{PASSWORD}}
  expect: Параметры grant переданы
Step 2: Извлечь access_token, token_type, expires_in; сохранить {{access_token}}
  expect: HTTP 200; access_token непустой; expires_in>0
Импорт в Frontier: testcases-import/7937.json
*/

test('7937 API-CP-01 Получение access_token (внешний IdP)', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-checks.spec.ts');
});
