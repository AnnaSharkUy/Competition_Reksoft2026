import { test } from '@playwright/test';

/*
Frontier Id: 8887
Area: UI/Library/Pagination
Priority: Medium Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Библиотека без фильтров. Выбрать размер, при котором N не делится на S без остатка.
Expected: На последней странице ровно N mod S карточек, пустых карточек-заглушек сверх результата нет.
Step 0: Выбрать размер 120, если N mod 120 не равен 0. Иначе выбрать другой доступный размер с ненулевым остатком.
  expect: Размер применён, последняя страница существует.
Step 1: Открыть последнюю страницу и посчитать карточки.
  expect: Число карточек равно N mod S, не равно нулю и не больше S. Next page недоступен.
Импорт в Frontier: testcases-import/8887.json
*/

test('8887 UI-LIB-PAG-09 Неполная последняя страница', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
