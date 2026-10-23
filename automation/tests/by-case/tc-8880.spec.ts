import { test } from '@playwright/test';

/*
Frontier Id: 8880
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека открыта, фильтры сброшены, результатов больше одного размера страницы, пользователь на странице 1.
Expected: Открывается следующая страница, набор карточек меняется, предыдущая страница снова доступна.
Step 0: Зафиксировать имена первых трёх карточек страницы 1 и значение «Всего».
  expect: Данные страницы 1 зафиксированы, «Всего» не меняется от самого перехода.
Step 1: Нажать Next page.
  expect: Текущей становится страница 2. Previous page доступен. Первые карточки отличаются от страницы 1. Число карточек не больше выбранного размера, кроме последней страницы.
Step 2: Нажать Next page ещё раз.
  expect: Текущей становится страница 3. Набор карточек отличается от страниц 1 и 2. Ошибок загрузки и пустого экрана нет.
Импорт в Frontier: testcases-import/8880.json
*/

test('8880 UI-LIB-PAG-02 Переход на следующую страницу', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
