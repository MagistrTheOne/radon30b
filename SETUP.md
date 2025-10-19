# 🚀 Radon AI - Инструкция по запуску

## Быстрый старт

### 1. Установка зависимостей

```bash
# Frontend зависимости
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта (скопируйте из `.env.example`):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ
CLERK_SECRET_KEY=sk_test_ваш_секрет
CLERK_WEBHOOK_SECRET=whsec_ваш_webhook_секрет

# Database - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_4crtzYWU2lqS@ep-rough-thunder-adksjh68-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Radon AI API v2.0.0 - Production Backend (Server-side only)
RADON_API_URL=http://213.219.215.235:8000
RADON_API_KEY=optional_if_needed
RADON_DEFAULT_PERSONALITY=helpful
RADON_ENABLE_FUNCTIONS=true
```

### 3. Настройка базы данных

```bash
# Выполните миграции Drizzle
npm run db:push
```

### 4. Запуск приложения

```bash
# Терминал 1: Frontend (Next.js)
npm run dev

# Терминал 2: Redis (опционально для кэширования)
docker-compose -f docker-compose.simple.yml up redis
```

### 5. Доступ к приложению

- **Frontend**: http://localhost:3000
- **AI Backend**: http://213.219.215.235:8000 (внешний сервис)
- **API Documentation**: http://localhost:3000/api (Next.js API routes)

## 🐳 Docker (для локальной разработки)

```bash
# Запуск Redis и PostgreSQL
docker-compose -f docker-compose.simple.yml up -d

# Просмотр логов
docker-compose -f docker-compose.simple.yml logs -f

# Остановка
docker-compose -f docker-compose.simple.yml down
```

## 📋 Что реализовано

### ✅ Frontend (Next.js 15)
- [x] Landing page с Hero, Features, Pricing, About секциями
- [x] Clerk аутентификация (sign-in/sign-up)
- [x] Chat интерфейс с sidebar
- [x] MessageList с поддержкой markdown и подсветкой кода
- [x] MessageInput с загрузкой изображений
- [x] Theme toggle (светлая/темная тема)
- [x] Responsive дизайн
- [x] Framer Motion анимации

### ✅ Backend (Next.js API Routes)
- [x] API endpoints для чатов и сообщений
- [x] Drizzle ORM модели (User, Chat, Message)
- [x] TypeScript схемы для валидации
- [x] Интеграция с внешним AI сервисом
- [x] Streaming ответы (SSE)
- [x] CORS настройки
- [x] Webhook обработка Clerk

### ✅ Database (PostgreSQL + Drizzle)
- [x] Drizzle schema
- [x] Миграции
- [x] Связи между таблицами

### ✅ DevOps
- [x] Docker конфигурация (упрощенная)
- [x] Environment переменные
- [x] README с документацией

## 🔧 Настройка Clerk

1. Создайте аккаунт на [clerk.com](https://clerk.com)
2. Создайте новое приложение
3. Скопируйте ключи в `.env.local`
4. Настройте webhook URL: `http://localhost:3000/api/webhooks/clerk`

## 🎯 Следующие шаги

1. **Настройка PostgreSQL** - используйте Neon (уже настроено)
2. **Деплой на Vercel** - для frontend
3. **Настройка домена** - для production
4. **Мониторинг AI Backend** - проверка доступности внешнего сервиса

## 🐛 Решение проблем

### Ошибка сборки
```bash
# Очистите кэш и переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Ошибка базы данных
```bash
# Проверьте подключение к PostgreSQL
psql $DATABASE_URL

# Выполните миграции заново
npm run db:push
```

### Ошибка Clerk
- Проверьте правильность ключей в `.env.local`
- Убедитесь, что webhook URL настроен правильно

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в терминале
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что PostgreSQL доступен
4. Обратитесь к документации Clerk и Next.js

---

**Radon AI** - Российская мультимодальная нейросеть 30B параметров  
Разработано MagistrTheOne в Краснодаре 🇷🇺
