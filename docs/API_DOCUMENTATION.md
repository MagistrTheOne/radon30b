# 🚀 Radon AI API Documentation

## 📋 Обзор

Radon AI предоставляет RESTful API для взаимодействия с мультимодальной нейросетью 30B параметров. API поддерживает создание чатов, отправку сообщений, управление пользователями и интеграцию с Clerk для аутентификации.

## 🔐 Аутентификация

Все API endpoints (кроме публичных) требуют аутентификации через Clerk:

```http
Authorization: Bearer <clerk_session_token>
```

### Публичные endpoints:
- `GET /api/radon/health` - Проверка состояния Radon AI
- `GET /api/radon/personalities` - Получение доступных личностей

## 📊 Основные endpoints

### 1. Управление чатами

#### `GET /api/chats`
Получить список чатов текущего пользователя.

**Ответ:**
```json
[
  {
    "id": "chat_123",
    "title": "Мой чат",
    "createdAt": "2025-01-18T10:30:00Z",
    "messageCount": 5
  }
]
```

#### `POST /api/chats`
Создать новый чат.

**Запрос:**
```json
{
  "title": "Новый чат"
}
```

**Ответ:**
```json
{
  "id": "chat_456",
  "title": "Новый чат",
  "createdAt": "2025-01-18T10:30:00Z",
  "messageCount": 0
}
```

#### `GET /api/chats/{chatId}`
Получить чат с сообщениями.

**Ответ:**
```json
{
  "id": "chat_123",
  "title": "Мой чат",
  "createdAt": "2025-01-18T10:30:00Z",
  "messageCount": 2,
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Привет!",
      "createdAt": "2025-01-18T10:30:00Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "Привет! Как дела?",
      "createdAt": "2025-01-18T10:30:05Z"
    }
  ]
}
```

#### `PUT /api/chats/{chatId}`
Обновить название чата.

**Запрос:**
```json
{
  "title": "Новое название"
}
```

#### `DELETE /api/chats/{chatId}`
Удалить чат.

### 2. Сообщения

#### `POST /api/chats/{chatId}/messages`
Отправить сообщение в чат.

**Запрос:**
```json
{
  "content": "Привет, Radon!",
  "imageUrl": "https://example.com/image.jpg", // опционально
  "personality": "helpful" // опционально
}
```

**Ответ:**
```json
{
  "id": "msg_123",
  "role": "assistant",
  "content": "Привет! Как дела?",
  "createdAt": "2025-01-18T10:30:00Z"
}
```

#### `PUT /api/chats/{chatId}/messages/{messageId}`
Редактировать сообщение.

**Запрос:**
```json
{
  "content": "Отредактированное сообщение"
}
```

#### `DELETE /api/chats/{chatId}/messages/{messageId}`
Удалить сообщение.

### 3. Radon AI API

#### `GET /api/radon/health`
Проверить состояние Radon AI.

**Ответ:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "gpu_available": true
}
```

#### `GET /api/radon/personalities`
Получить доступные личности.

**Ответ:**
```json
[
  {
    "id": "helpful",
    "name": "Помощник",
    "description": "Дружелюбный и полезный ассистент"
  },
  {
    "id": "creative",
    "name": "Креативщик",
    "description": "Творческий и вдохновляющий"
  }
]
```

#### `POST /api/radon/chat`
Прямое обращение к Radon AI (для внутреннего использования).

**Запрос:**
```json
{
  "message": "Привет!",
  "personality": "helpful",
  "conversation_id": "conv_123",
  "user_id": "user_456",
  "enable_functions": true
}
```

## 🔄 Drizzle ORM API (Новая версия)

### `GET /api/chats-drizzle`
Получить список чатов через Drizzle ORM.

### `POST /api/chats-drizzle`
Создать новый чат через Drizzle ORM.

## 📝 Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успешно |
| 201 | Создано |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Доступ запрещен |
| 404 | Не найдено |
| 500 | Внутренняя ошибка сервера |
| 503 | Сервис недоступен |

## 🔧 Примеры использования

### JavaScript/TypeScript

```typescript
// Создание чата
const response = await fetch('/api/chats', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({
    title: 'Мой новый чат'
  })
});

const chat = await response.json();
console.log('Создан чат:', chat);
```

### cURL

```bash
# Получить список чатов
curl -X GET "http://localhost:3000/api/chats" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Создать новый чат
curl -X POST "http://localhost:3000/api/chats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"title": "Новый чат"}'
```

## 🚀 Производительность

### Оптимизации Drizzle ORM:
- **Пул соединений**: До 20 одновременных соединений
- **Таймауты**: 10 секунд на подключение, 20 секунд на idle
- **SSL**: Обязательное шифрование для production
- **Логирование**: Включено в development режиме

### Рекомендации:
1. Используйте пагинацию для больших списков
2. Кэшируйте часто запрашиваемые данные
3. Используйте streaming для длинных ответов
4. Мониторьте использование соединений к БД

## 🔒 Безопасность

1. **Аутентификация**: Все endpoints защищены Clerk
2. **Валидация**: Входные данные проверяются
3. **SQL Injection**: Защита через Drizzle ORM
4. **Rate Limiting**: Ограничение запросов (планируется)
5. **CORS**: Настроен для production доменов

## 📈 Мониторинг

### Логи:
- Все API запросы логируются
- Ошибки базы данных отслеживаются
- Производительность запросов мониторится

### Метрики:
- Время ответа API
- Количество активных соединений
- Статус Radon AI
- Использование памяти

## 🛠️ Разработка

### Локальная разработка:
```bash
# Запуск сервера разработки
npm run dev

# Запуск Prisma Studio
npx prisma studio

# Генерация миграций Drizzle
npx drizzle-kit generate

# Применение миграций
npx drizzle-kit migrate
```

### Переменные окружения:
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
RADON_API_URL=http://213.219.215.235:8000
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь в правильности аутентификации
3. Проверьте статус Radon AI: `GET /api/radon/health`
4. Обратитесь к разработчикам

---

**Версия API**: 2.0.0  
**Последнее обновление**: 18 января 2025  
**Автор**: MagistrTheOne
