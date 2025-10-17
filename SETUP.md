# 🚀 Radon AI - Инструкция по запуску

## Быстрый старт

### 1. Установка зависимостей

```bash
# Frontend зависимости (уже установлены)
npm install

# Backend зависимости
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ
CLERK_SECRET_KEY=sk_test_ваш_секрет
CLERK_WEBHOOK_SECRET=whsec_ваш_webhook_секрет

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/radonai

# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Radon AI (для будущей интеграции)
RADON_AI_API_KEY=ваш_ключ_radon_ai
RADON_AI_API_URL=https://api.radonai.com/v1
```

### 3. Настройка базы данных

```bash
# Создайте PostgreSQL базу данных
createdb radonai

# Выполните миграции Prisma
npx prisma migrate dev
npx prisma generate
```

### 4. Запуск приложения

```bash
# Терминал 1: Backend (FastAPI)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Терминал 2: Frontend (Next.js)
npm run dev
```

### 5. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker (альтернативный способ)

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
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

### ✅ Backend (FastAPI)
- [x] API endpoints для чатов и сообщений
- [x] SQLAlchemy модели (User, Chat, Message)
- [x] Pydantic схемы для валидации
- [x] AI Service заглушка для Radon AI
- [x] Streaming ответы (SSE)
- [x] CORS настройки
- [x] Webhook обработка Clerk

### ✅ Database (PostgreSQL + Prisma)
- [x] Prisma schema
- [x] Миграции
- [x] Связи между таблицами

### ✅ DevOps
- [x] Docker конфигурация
- [x] Environment переменные
- [x] README с документацией

## 🔧 Настройка Clerk

1. Создайте аккаунт на [clerk.com](https://clerk.com)
2. Создайте новое приложение
3. Скопируйте ключи в `.env.local`
4. Настройте webhook URL: `http://localhost:3000/api/webhooks/clerk`

## 🎯 Следующие шаги

1. **Интеграция с Radon AI API** - замените заглушку в `backend/app/services/ai_service.py`
2. **Настройка PostgreSQL** - создайте production базу данных
3. **Деплой на Vercel** - для frontend
4. **Деплой на Railway/Render** - для backend
5. **Настройка домена** - для production

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
psql -h localhost -U user -d radonai

# Выполните миграции заново
npx prisma migrate reset
npx prisma migrate dev
```

### Ошибка Clerk
- Проверьте правильность ключей в `.env.local`
- Убедитесь, что webhook URL настроен правильно

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в терминале
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что PostgreSQL запущен
4. Обратитесь к документации Clerk и Next.js

---

**Radon AI** - Российская мультимодальная нейросеть 30B параметров  
Разработано MagistrTheOne в Краснодаре 🇷🇺
