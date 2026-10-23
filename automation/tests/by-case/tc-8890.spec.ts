import { test } from '@playwright/test';

/*
Frontier Id: 8890
Area: UI/Library/Filters
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-filters-search.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Вкладка «Категории» открыта, другие фильтры и поиск сброшены, размер страницы 24.
Expected: Выдача и «Всего» соответствуют выбранной категории. Пагинация пересчитана от нового «Всего».
Step 0: Зафиксировать исходное «Всего», затем отметить чекбокс «Изображение». Зафиксировать счётчик рядом с категорией.
  expect: Чекбокс отмечен. «Всего» меняется на число, согласованное со счётчиком категории. На экране только активы этой категории.
Step 1: Проверить номер текущей страницы и число страниц.
  expect: Текущая страница — 1. Число страниц равно ceil(Всего / 24). Previous page недоступен.
Импорт в Frontier: testcases-import/8890.json
*/

test('8890 UI-LIB-FIL-01 Один фильтр категории', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-filters-search.spec.ts');
});
