import { test } from '@playwright/test';

/*
Frontier Id: 8518
Area: Авторизация
Priority: High Status: Actual
Automation: manual
Reason: UI-вход уже есть в фикстуре. Отдельный обход авторизации не пишем: безопасность вне скоупа.
Preconditions: Известны валидные username/password пользователя DAM
Expected: Пользователь успешно авторизуется используя валидные username/password
Step 0: 
Открыть DAM веб-сайт
  expect: Редирект на страницу авторизации
Step 1: Авторизоваться используя username/password
  expect: 
Страница Library открыта
Импорт в Frontier: testcases-import/8518.json
*/

test('8518 Успешная авторизация ', async () => {
  test.fixme(true, 'UI-вход уже есть в фикстуре. Отдельный обход авторизации не пишем: безопасность вне скоупа.');
});
