import { test } from '@playwright/test';

/*
Frontier Id: 8889
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека без фильтров, страниц больше двух.
Expected: Ровно одна страница имеет состояние current. Её номер совпадает с подсветкой, а карточки принадлежат этой странице.
Step 0: На странице 1 проверить, какой номер подсвечен и какой элемент имеет состояние current page.
  expect: Подсвечена и является current только страница 1.
Step 1: Перейти на страницу 2 и повторить проверку.
  expect: Подсвечена и является current только страница 2. Карточки изменились относительно страницы 1.
Импорт в Frontier: testcases-import/8889.json
*/

test('8889 UI-LIB-PAG-11 Согласованность текущей страницы и выдачи', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
