import { test } from '@playwright/test';

/*
Frontier Id: 8882
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека без фильтров, размер страницы 24, страниц больше 5.
Expected: Открывается выбранная страница, подсветка и набор карточек соответствуют именно ей.
Step 0: На странице 1 нажать кнопку Page 4.
  expect: Текущей становится страница 4. Previous page доступен. Карточки не совпадают с первыми карточками страницы 1.
Step 1: Нажать Page 1.
  expect: Происходит возврат на страницу 1. Previous page недоступен. Набор карточек снова соответствует началу списка.
Импорт в Frontier: testcases-import/8882.json
*/

test('8882 UI-LIB-PAG-04 Прямой переход на номер страницы', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
