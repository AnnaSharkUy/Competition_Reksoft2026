import { test } from '@playwright/test';

/*
Frontier Id: 8900
Area: UI/Library/Filters+Pagination
Priority: Medium Status: Actual
Automation: covered -> automation/tests/ui/library-filters-search.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Применён фильтр «Изображение» или другой фильтр с известным «Всего», открыта страница 2.
Expected: Фильтр остаётся активным. «Всего» прежнее. Число страниц становится ceil(Всего / 60). Пользователь находится на существующей странице.
Step 0: При активном фильтре на странице 2 выбрать размер 60.
  expect: Размер 60 применён. Чекбокс фильтра остаётся отмеченным. «Всего» не меняется из-за смены размера.
Step 1: Проверить номер текущей страницы и число карточек.
  expect: Текущая страница существует в новом диапазоне. На полной странице не больше 60 карточек, и все они соответствуют фильтру.
Импорт в Frontier: testcases-import/8900.json
*/

test('8900 UI-LIB-COM-03 Смена размера страницы сохраняет фильтр', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-filters-search.spec.ts');
});
