import { test } from '@playwright/test';

/*
Frontier Id: 8884
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека открыта на странице 1, фильтры сброшены.
Expected: Previous page недоступен и не меняет страницу. Повторный клик не вызывает ошибку.
Step 0: Убедиться, что текущая страница — 1, и проверить состояние Previous page.
  expect: Кнопка Previous page недоступна: disabled либо клик не выполняет переход.
Step 1: Попытаться активировать Previous page мышью и с клавиатуры.
  expect: Страница остаётся 1, список не меняется, ошибка интерфейса и ответ 500 не появляются.
Импорт в Frontier: testcases-import/8884.json
*/

test('8884 UI-LIB-PAG-06 Previous page недоступен на первой странице', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
