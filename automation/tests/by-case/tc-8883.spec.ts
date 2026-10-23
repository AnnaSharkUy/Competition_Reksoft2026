import { test } from '@playwright/test';

/*
Frontier Id: 8883
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека без фильтров, результатов больше одного размера страницы.
Expected: Page 1 и кнопка последней страницы открывают границы списка. За границу перейти нельзя.
Step 0: Зафиксировать последнюю видимую кнопку номера страницы, например Page 31 при 726 результатах и размере 24. Нажать её.
  expect: Открыта последняя страница. Её номер совпадает с ceil(Всего / размер). Next page недоступен.
Step 1: Нажать Page 1.
  expect: Открыта страница 1. Previous page недоступен. Карточки соответствуют началу списка.
Импорт в Frontier: testcases-import/8883.json
*/

test('8883 UI-LIB-PAG-05 Переход на первую и последнюю страницу', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
