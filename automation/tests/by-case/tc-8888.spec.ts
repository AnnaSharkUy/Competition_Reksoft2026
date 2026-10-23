import { test } from '@playwright/test';

/*
Frontier Id: 8888
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: В дереве категорий доступна категория с положительным счётчиком не больше 24, например «Аудио» или «ED_edit». Точный счётчик сверить перед запуском.
Expected: Показаны все найденные активы. Пагинация скрыта либо обе стрелки и лишние номера страниц недоступны. Пустой экран не показывается.
Step 0: На вкладке «Категории» отметить категорию, у которой счётчик больше 0 и не больше 24. Зафиксировать счётчик C.
  expect: «Всего» становится равно C либо документированному числу с учётом вложенных элементов. Карточек на экране ровно столько, сколько заявлено.
Step 1: Проверить блок пагинации и размер страницы 24.
  expect: Вторая страница отсутствует или недоступна. Previous page и Next page не выполняют переход. Ошибки нет.
Импорт в Frontier: testcases-import/8888.json
*/

test('8888 UI-LIB-PAG-10 Пагинация при выборке на одну страницу', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
