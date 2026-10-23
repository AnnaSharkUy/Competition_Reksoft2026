import { test } from '@playwright/test';

/*
Frontier Id: 8879
Area: UI/Library/Pagination
Priority: High Status: Actual
Automation: covered -> automation/tests/ui/library-pagination.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Пользователь авторизован и открыта страница Библиотека. Фильтры и поисковая строка пустые. Сортировка не менялась в этом кейсе.
Expected: Пагинация отображается, если результатов больше размера страницы. Текущая страница — 1, Previous page недоступен, число страниц равно ceil(Всего / размер страницы).
Step 0: Открыть https://dam.rex.lab.reksoft.com/Library без параметров фильтра и страницы.
  expect: Открыт список активов. Внизу есть «Всего: N», список страниц и поле размера страницы.
Step 1: Зафиксировать N из «Всего», выбранный размер страницы S и число карточек на экране.
  expect: S по умолчанию равен 24. Число карточек не больше S. Если N > S, видна пагинация и последняя страница равна ceil(N / S).
Step 2: Проверить подсветку и доступное имя текущей страницы, кнопки Previous page и Next page.
  expect: Текущей отмечена только страница 1. Previous page недоступен. Next page доступен, если страниц больше одной. Многоточие «…» не является кнопкой перехода.
Импорт в Frontier: testcases-import/8879.json
*/

test('8879 UI-LIB-PAG-01 Начальное состояние пагинации Library', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/ui/library-pagination.spec.ts');
});
