# Radon AI - Мультимодальная нейросеть 30B параметров

Российская разработка от MagistrTheOne (Краснодар) - мощная мультимодальная нейросеть для генерации текста, анализа изображений и создания кода.

## 🚀 Возможности

- **Текстовая генерация**: Создание контента, переводы, анализ документов
- **Анализ изображений**: Распознавание объектов, описание картинок
- **Кодогенерация**: Написание кода на любых языках программирования
- **Мультимодальность**: Обработка текста, изображений и кода в едином интерфейсе
- **30B параметров**: Мощная архитектура для максимальной точности
- **Российская разработка**: Лучшее понимание русского языка

## 🛠 Технологический стек

### Frontend
- **Next.js 15** - React фреймворк
- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **ShadCN UI** - Компоненты
- **Clerk** - Аутентификация
- **Prisma** - ORM
- **Framer Motion** - Анимации

### Backend
- **FastAPI** - Python веб-фреймворк
- **PostgreSQL** - База данных
- **SQLAlchemy** - ORM
- **Pydantic** - Валидация данных
- **Uvicorn** - ASGI сервер

## 📦 Установка и запуск

### Предварительные требования

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker (опционально)

### Локальная разработка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd radonfront
```

2. **Установка зависимостей**
```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Настройка переменных окружения**
```bash
# Скопируйте .env.example в .env.local
cp .env.example .env.local

# Заполните необходимые переменные:
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - DATABASE_URL
# - RADON_AI_API_KEY (для интеграции с Radon AI)
```

4. **Настройка базы данных**
```bash
# Создайте базу данных PostgreSQL
createdb radonai

# Выполните миграции Prisma
npx prisma migrate dev
npx prisma generate
```

5. **Запуск приложения**
```bash
# Терминал 1: Backend
cd backend
uvicorn app.main:app --reload

# Терминал 2: Frontend
npm run dev
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## 🏗 Архитектура

```
radonfront/
├── src/
│   ├── app/
│   │   ├── (landing)/          # Публичные страницы
│   │   ├── (auth)/             # Аутентификация
│   │   ├── (chat)/             # Чат приложение
│   │   └── api/                # API роуты
│   ├── components/
│   │   ├── landing/            # Компоненты лендинга
│   │   ├── chat/               # Компоненты чата
│   │   └── ui/                 # ShadCN компоненты
│   ├── lib/                    # Утилиты
│   └── types/                  # TypeScript типы
├── backend/
│   ├── app/
│   │   ├── routers/            # API роуты
│   │   ├── models/             # SQLAlchemy модели
│   │   ├── schemas/            # Pydantic схемы
│   │   └── services/           # Бизнес-логика
│   └── requirements.txt
├── prisma/
│   └── schema.prisma           # Схема базы данных
└── docker-compose.yml
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/users` - Создание пользователя
- `GET /api/auth/users/{clerk_id}` - Получение пользователя
- `PUT /api/auth/users/{clerk_id}` - Обновление пользователя

### Чаты
- `POST /api/chats/new` - Создание нового чата
- `GET /api/chats` - Список чатов пользователя
- `GET /api/chats/{chat_id}` - Получение чата с сообщениями
- `PUT /api/chats/{chat_id}` - Обновление чата
- `DELETE /api/chats/{chat_id}` - Удаление чата

### Сообщения
- `POST /api/chats/{chat_id}/messages` - Отправка сообщения
- `POST /api/chats/{chat_id}/stream` - Стриминг ответа

## 🎨 UI/UX

- **Дизайн**: ChatGPT-стиль с glass-morphism эффектами
- **Темы**: Светлая, темная, системная
- **Responsive**: Адаптивный дизайн для всех устройств
- **Анимации**: Плавные переходы с Framer Motion
- **Accessibility**: ARIA labels, keyboard navigation

## 🔐 Безопасность

- **Аутентификация**: Clerk с социальными входами
- **Авторизация**: Middleware для защиты роутов
- **CORS**: Настроен для production доменов
- **Rate Limiting**: Ограничения по подписке
- **Валидация**: Pydantic схемы для всех данных

## 📊 Мониторинг

- **Health Checks**: `/health` endpoint
- **Логирование**: Структурированные логи
- **Метрики**: Использование по подпискам
- **Ошибки**: Graceful error handling

## 🚀 Деплой

### Vercel (Frontend)
```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### Railway/Render (Backend)
```bash
# Настройте переменные окружения
# DATABASE_URL, RADON_AI_API_KEY, etc.

# Деплой через Git
git push origin main
```

### Supabase/Neon (Database)
- Создайте PostgreSQL инстанс
- Обновите DATABASE_URL
- Выполните миграции

## 📝 Лицензия

MIT License - см. файл LICENSE

## 👨‍💻 Разработчик

**MagistrTheOne**  
Краснодар, Россия  
Email: [ваш-email]  
GitHub: [ваш-github]

## 🤝 Поддержка

- 📧 Email: maxonyushko71@gmail.com


---

Сделано с ❤️ в России 🇷🇺
