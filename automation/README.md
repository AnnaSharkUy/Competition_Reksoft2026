# Автоматизация DAM на Playwright

Источник ручных кейсов — Frontier. Автотест не заменяет кейс: в названии теста стоит тот же ID (`API-SET-R01`, `UI-LIB-PAG-02`).

## Что автоматизировать и в каком порядке

1. **API, только чтение.** `GET /SystemSettings`, категории библиотеки, `POST /Asset/Search` с `page` / `pageSize`. Быстро, без браузера, не меняет стенд.
2. **UI smoke Библиотеки.** Первая страница, «Next page» / «Previous page», смена размера 24 → 48. Числа `726` и `31` не зашивать: страниц всегда `ceil(Всего / размер)`.
3. **API, которые создают данные.** Загрузка, комментарий, коллекция, saved search. Только после read-smoke. Каждый тест создаёт свои данные и удаляет их в `finally`. Чужие активы не удалять.
4. **UI фильтры.** После того как smoke пагинации стабилен. Категории брать из дерева (`Изображение`, `Аудио`, `Мода`), а не из захардкоженных счётчиков.

Не автоматизировать первыми: security/auth как отдельную группу, конкурентное редактирование, кейсы с «кнопки может не быть» (`UI-LIB-FIL-07`, `UI-LIB-FIL-08`).

## Как устроен прогон

```text
Frontier case ID
    -> tests/api или tests/ui
        -> page object / request
            -> .env (токен или логин)
                -> HTML-отчёт + trace только при падении
```

- `tests/api` — Playwright `request`, без браузера. Заголовок `Authorization: Bearer` или `X-Api-Key`. Password grant в OpenAPI DAM нет, токен берётся снаружи.
- `tests/ui` — Chromium, вход через форму IdP, затем `/Library`.
- Локаторы пагинации уже сняты со стенда: кнопки `Previous page` и `Next page`, номера `Page N`, размеры 24 / 48 / 60 / 120.
- Карточки активов и точный текст счётчика «Всего» на этом окружении не перепроверялись. Если smoke упадёт на них, один раз поправьте селектор в `pages/library.page.ts`, а не копируйте локатор в каждый тест.
- Секреты только в `automation/.env`. В репозиторий и в чат пароль не класть.

## Playwright CLI

Инструкция «Playwright CLI + Cursor» подключена к этому проекту, а не к новому `npm init`.

- Пакет `@playwright/cli` стоит локально. Глобальная установка не нужна: из этой папки `npm run cli -- --help`.
- Скилл агента: `.agents/skills/playwright-cli` (WorkAI), копия `.cursor/skills/playwright-cli` (Cursor) и `~\.agents\skills\playwright-cli`.
- `.claude` оставлен: установщик пишет туда по умолчанию. Переименовывать его в `.cursor` не нужно, копия уже есть.
- Снапшоты CLI пишутся в `.playwright-cli/` и в git не попадают: там могут быть сессия и куки.
- Браузер по умолчанию — установленный Chrome. Для прогона тестов по-прежнему Chromium из `npx playwright install chromium`.

Разбор страницы, не прогон тестов:

```powershell
npm run cli -- open https://dam.rex.lab.reksoft.com/Library
npm run cli -- snapshot
npm run cli -- close
```

После снапшота агент пишет тест в `tests/ui`, с ID кейса Frontier в названии. Числа стенда не зашивать.

## Первый запуск

Из папки `automation`:

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

В `.env` заполните `DAM_TOKEN` или `DAM_API_KEY` для API и `DAM_USER` / `DAM_PASSWORD` для UI.

```powershell
npm run test:api
npm run test:ui
npm run report
```

Если форма входа не находится, снимите её один раз и перенесите устойчивый локатор в `src/auth.ts`:

```powershell
$env:DAM_UI_BASE = "https://dam.rex.lab.reksoft.com"
npm run codegen -- $env:DAM_UI_BASE/Library
```

Без заполненного `.env` тесты пропускаются (`skipped`), а не падают.

## Как добавлять следующий кейс

1. Возьмите один ID из Frontier, не пачку.
2. Название теста = ID + короткое действие.
3. Один ожидаемый результат. Не пишите «200 или 404».
4. Не фиксируйте `totalHits` стенда. Сравнивайте страницы между собой: длина ≤ `pageSize`, нет общих id, `totalHits` одинаковый.
5. Мутирующий тест: уникальное имя с префиксом `PW-`, удаление в `finally`, повторный GET после удаления.
6. Упавший тест смотрите в `playwright-report` и `test-results` (trace). Не перезапускайте пачку, пока не понятна причина одного падения.
7. После зелёного прогона отметьте кейс в Frontier тегом `automated`.

## Чего не делать

- Не хардкодить `726` / `31`.
- Не гонять delete/replace/business action на чужих активах.
- Не класть `page` и `pageSize` внутрь `searchParameters` сохранённого поиска: в OpenAPI у этой схемы `additionalProperties: false`.
- Не чинить падение переписыванием ожидания под фактический баг. Сначала зафиксируйте расхождение с кейсом.
