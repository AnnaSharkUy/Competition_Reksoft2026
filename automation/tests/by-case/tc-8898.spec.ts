import { test } from '@playwright/test';

/*
Frontier Id: 8898
Area: UI/Library/Filters+Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-filters-search.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Фильтры сброшены, размер 24, страниц больше 5.
Expected: После применения фильтра открыта страница 1 отфильтрованной выборки, даже если прежний номер страницы больше нового числа страниц.
Step 0: Перейти на страницу 5 без фильтра. Зафиксировать номер страницы и первые карточки.
  expect: Открыта страница 5 полной выборки.
Step 1: Отметить категорию «Аудио» или другую категорию, у которой результатов меньше чем на 5 страниц.
  expect: Текущая страница становится 1. Показывается выдача фильтра, а не пустая страница 5. Previous page недоступен.
Step 2: Проверить, что номер в пагинации не больше числа страниц новой выборки.
  expect: Нет активной несуществующей страницы, пустого экрана и ошибки загрузки.
Импорт в Frontier: testcases-import/8898.json
*/

test('8898 UI-LIB-COM-01 Фильтр сбрасывает текущую страницу на первую', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-filters-search.spec.ts');
});
