# Competition_Reksoft2026
Project Debuggers v5.0

## Автотесты

Playwright-проект лежит в `automation/`. Пароли и токены в репозиторий не входят: скопируйте `automation/.env.example` в `.env` и заполните его только локально.

```powershell
cd automation
npm install
npx playwright install chromium
Copy-Item .env.example .env
npm test
```

Обычный прогон — API и UI. Заготовки `tests/by-case` в него не входят. Один кейс: `npm run test:cases -- tc-<Id>`.

Подробности запуска и ограничений: `automation/README.md`.
