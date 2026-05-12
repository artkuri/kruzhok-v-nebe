# Telegram Bot MVP

Telegram-бот может работать в двух режимах:

- локально через polling
- на Vercel через webhook route внутри Next.js

## Архитектура

- `src/bot` — Telegraf bootstrap, middleware, handlers, keyboards, formatters
- `src/services` — бизнес-логика авторизации, расписания, детей, записей и абонементов
- `src/repositories` — SQL-доступ к PostgreSQL через `pg`
- `src/dto` — DTO и typed contracts между слоями
- `src/lib` — pool, logger, helpers

## Почему отдельно

- не смешивает Telegram domain-логику с UI и страницами
- не зависит от Prisma в слое бота
- сохраняет чистую архитектуру и дает переиспользовать те же правила записи/отмены

## Запуск

```bash
npm install
psql "$DATABASE_URL" -f sql/001_add_telegram_id_to_user.sql
psql "$DATABASE_URL" -f sql/002_create_telegram_sessions.sql
npm run bot:dev
```

## Vercel webhook

После деплоя сайта на Vercel:

1. добавить env `BOT_TOKEN` и `BOT_WEBHOOK_SECRET`
2. открыть `POST /api/telegram/register-webhook` с заголовком `Authorization: Bearer <BOT_WEBHOOK_SECRET>`
3. Telegram начнет отправлять обновления в `POST /api/telegram/webhook`

## Структура

```text
telegram-bot/
  src/
    bot/
      context.ts
      register.ts
      middleware/auth.ts
      handlers/
      keyboards/
      utils/
    config/
    dto/
    lib/
    repositories/
    services/
    index.ts
```
