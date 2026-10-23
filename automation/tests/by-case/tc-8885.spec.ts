import { test } from '@playwright/test';

/*
Frontier Id: 8885
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека без фильтров, открыта последняя страница.
Expected: Next page недоступен. Число карточек на последней странице равно N - (страниц - 1) * S и находится в диапазоне от 1 до S.
Step 0: Перейти на последнюю страницу кнопкой её номера. Зафиксировать N, S и число карточек.
  expect: Номер страницы равен ceil(N / S). Число карточек равно остатку, а при делении без остатка равно S.
Step 1: Проверить Next page и попытаться активировать её.
  expect: Next page недоступен. Страница и список не меняются, пустой экран и ошибка сервера не появляются.
Импорт в Frontier: testcases-import/8885.json
*/

test('8885 UI-LIB-PAG-07 Next page недоступен на последней странице', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
