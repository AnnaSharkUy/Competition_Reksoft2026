import { test } from '@playwright/test';

/*
Frontier Id: 6761
Area: Администрирование/Модель статусов/Статусы
Priority: Medium Status: Actual
Automation: manual
Reason: Админка, роли и права. Автотест не меняет пользователей, группы и разрешения.
Preconditions: Пользователь является администратором
Expected: 
Step 0: Открыть Админку
Step 1: Авторизоваться как Administrator
Step 2: Авторизоваться как Administrator
Step 3: Авторизоваться как Administrator
Step 4: Убедиться, что напротив статуса Создан есть только иконка Редактирование и нет иконки Удалить
Импорт в Frontier: testcases-import/6761.json
*/

test('6761 Нельзя удалить статус Создан', async () => {
  test.fixme(true, 'Админка, роли и права. Автотест не меняет пользователей, группы и разрешения.');
});
