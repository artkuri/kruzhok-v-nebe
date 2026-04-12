# Кружок в небе — MVP веб-приложение

Система записи на занятия для студии творчества.

## Стек

- **Next.js 15** (App Router) + TypeScript
- **PostgreSQL** + Prisma ORM
- **Tailwind CSS** + Radix UI
- **Auth.js (NextAuth v5)** — JWT аутентификация

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных:

```sql
CREATE DATABASE kruzhok_v_nebe;
```

### 3. Переменные окружения

Скопируйте `.env.local` и заполните:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kruzhok_v_nebe"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Миграция и seed

```bash
npm run db:push     # применить схему
npm run db:seed     # заполнить тестовыми данными
```

### 5. Запуск

```bash
npm run dev
```

Открыть: http://localhost:3000

---

## Тестовые аккаунты (после seed)

| Роль           | Email                | Пароль     |
|----------------|----------------------|------------|
| Администратор  | admin@kruzhok.ru     | admin123   |
| Педагог        | elena@kruzhok.ru     | teacher123 |
| Педагог        | olga@kruzhok.ru      | teacher123 |
| Клиент         | maria@example.com    | client123  |

---

## Структура проекта

```
src/
├── app/
│   ├── (public)/          # Публичный сайт (главная, расписание, цены...)
│   ├── (auth)/            # Вход / регистрация
│   ├── (client)/cabinet/  # Личный кабинет клиента
│   ├── (admin)/admin/     # Кабинет администратора
│   ├── (teacher)/teacher/ # Кабинет педагога
│   └── api/               # REST API
├── components/
│   ├── ui/                # Базовые UI-компоненты
│   ├── layouts/           # Шапка, сайдбар, dashboard layout
│   └── features/          # Бизнес-компоненты
├── lib/
│   ├── auth.ts            # NextAuth конфигурация
│   ├── prisma.ts          # Prisma клиент
│   └── utils.ts           # Утилиты
└── types/                 # TypeScript типы
prisma/
├── schema.prisma          # Схема БД
└── seed.ts                # Тестовые данные
```

---

## API Endpoints

| Метод  | URL                             | Описание                        |
|--------|---------------------------------|---------------------------------|
| POST   | /api/users/register             | Регистрация                     |
| PATCH  | /api/users/profile              | Обновить профиль                |
| GET    | /api/children                   | Список детей семьи              |
| POST   | /api/children                   | Добавить ребёнка                |
| PATCH  | /api/children/[id]              | Редактировать ребёнка           |
| DELETE | /api/children/[id]              | Удалить ребёнка                 |
| GET    | /api/classes                    | Список занятий                  |
| POST   | /api/classes                    | Создать занятие (admin)         |
| GET    | /api/bookings                   | Список записей                  |
| POST   | /api/bookings                   | Создать запись                  |
| POST   | /api/bookings/[id]/cancel       | Отменить запись                 |
| POST   | /api/attendance                 | Отметить посещение              |
| GET    | /api/subscriptions              | Список абонементов              |
| POST   | /api/subscriptions              | Создать абонемент (admin)       |
| GET    | /api/payments                   | Список оплат (admin)            |
| POST   | /api/payments                   | Создать оплату (admin)          |
| POST   | /api/payments/[id]/mark-paid    | Отметить как оплачено (admin)   |
