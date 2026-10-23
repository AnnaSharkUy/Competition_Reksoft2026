import { test } from '@playwright/test';

/*
Frontier Id: 8895
Area: UI/Library/Filters
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-filters-search.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Фильтры сброшены. Выбрана конечная категория с небольшим стабильным счётчиком, например «Архив» или «Видео».
Expected: «Всего» равно счётчику выбранной конечной категории. Число страниц равно ceil(Всего / размер). На последней странице остаток сходится с «Всего».
Step 0: Зафиксировать счётчик C рядом с конечной категорией и отметить её чекбокс.
  expect: «Всего» показывает C. Текущая страница — 1.
Step 1: Если страниц больше одной, перейти на последнюю и посчитать карточки на всех страницах либо сверить остаток по формуле.
  expect: Фактическое число карточек на последней странице равно остатку. Расхождения со счётчиком C нет.
Импорт в Frontier: testcases-import/8895.json
*/

test('8895 UI-LIB-FIL-06 Счётчик категории совпадает с выдачей', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-filters-search.spec.ts');
});
