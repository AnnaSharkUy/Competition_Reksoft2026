import { test } from '@playwright/test';

/*
Frontier Id: 8881
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека открыта без фильтров, пользователь находится на странице 3 того же размера страницы.
Expected: Previous page возвращает на предыдущую страницу с прежним набором карточек, если данные стенда за время шага не изменились.
Step 0: На странице 3 зафиксировать имена первых трёх карточек.
  expect: Страница 3 открыта, Previous page и Next page доступны, если это не последняя страница.
Step 1: Нажать Previous page.
  expect: Текущей становится страница 2. Карточки соответствуют ранее виденной странице 2.
Step 2: Нажать Previous page ещё раз.
  expect: Текущей становится страница 1. Previous page недоступен. Карточки соответствуют исходной странице 1.
Импорт в Frontier: testcases-import/8881.json
*/

test('8881 UI-LIB-PAG-03 Возврат на предыдущую страницу', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
