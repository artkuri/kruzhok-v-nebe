# Telegram Bot MVP

Telegram-бот живет отдельно от Next.js runtime, но использует ту же PostgreSQL базу.

## Архитектура

- `src/bot` — Telegraf bootstrap, middleware, handlers, keyboards, formatters
- `src/services` — бизнес-логика авторизации, расписания, детей, записей и абонементов
- `src/repositories` — SQL-доступ к PostgreSQL через `pg`
- `src/dto` — DTO и typed contracts между слоями
- `src/lib` — pool, logger, helpers

## Почему отдельно

- не смешивает Telegram polling/webhook runtime с Next.js app router
- не зависит от Prisma в слое бота
- сохраняет чистую архитектуру и дает переиспользовать те же правила записи/отмены

## Запуск

```bash
npm install
psql "$DATABASE_URL" -f sql/001_add_telegram_id_to_user.sql
npm run bot:dev
```

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
