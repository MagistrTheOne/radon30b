# 🔧 **Исправление ошибок API аутентификации**

## 🚨 **Основная проблема:**
```
User not found at Object.createChat (src/lib/chat-api.ts:17:13)
```

## 🔍 **Причина:**
Пользователь авторизован через Clerk, но отсутствует в локальной базе данных PostgreSQL.

## ✅ **Решения:**

### **1. Создать пользователя вручную:**

#### **Шаг 1: Получить Clerk ID**
```bash
# В браузере (F12 → Console):
window.Clerk.user.id
# Скопировать полученный ID, например: user_2your_clerk_id_here
```

#### **Шаг 2: Создать пользователя**
```bash
# Установить переменную окружения
export CLERK_USER_ID=user_2your_clerk_id_here

# Или передать как параметр
node scripts/create-user.mjs user_2your_clerk_id_here
```

### **2. Автоматическая синхронизация пользователей:**

#### **Webhook для Clerk:**
```typescript
// src/app/api/webhooks/clerk/route.ts
export async function POST(request: NextRequest) {
  const payload = await request.json()
  const { type, data } = payload

  if (type === 'user.created') {
    // Создать пользователя в локальной БД
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address,
        role: 'user'
      }
    })
  }

  return NextResponse.json({ success: true })
}
```

### **3. Улучшенная обработка ошибок:**

#### **В API routes:**
```typescript
import { handleAPIError } from '@/lib/api-error-handler'

try {
  // Логика API
} catch (error) {
  const apiError = handleAPIError(error)
  return NextResponse.json(apiError, { status: apiError.status })
}
```

### **4. Проверка подключения к базе данных:**

#### **Тест подключения:**
```bash
# Проверить переменную DATABASE_URL
echo $DATABASE_URL

# Тест подключения
npx prisma db ping
```

#### **Если база недоступна:**
```bash
# Перезапустить базу данных
docker-compose down
docker-compose up -d postgres

# Или пересоздать базу
npx prisma db push --force-reset
```

## 🛠️ **Скрипты для исправления:**

### **Создание пользователя:**
```bash
node scripts/create-user.mjs
```

### **Синхронизация всех пользователей:**
```bash
node scripts/sync-users.mjs
```

### **Проверка базы данных:**
```bash
node scripts/check-db.mjs
```

## 🔍 **Диагностика:**

### **1. Проверить логи сервера:**
```bash
# В терминале с npm run dev
# Смотреть за ошибками аутентификации
```

### **2. Проверить базу данных:**
```bash
# Подключиться к базе
npx prisma studio

# Или проверить через SQL:
psql $DATABASE_URL
SELECT * FROM users WHERE clerk_id = 'your_clerk_id';
```

### **3. Проверить API routes:**
```bash
# Тест health endpoint
curl http://localhost:3000/api/radon/health

# Тест аутентификации
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/chats
```

## 🚀 **Быстрое исправление:**

1. **Получите ваш Clerk ID** из браузера
2. **Выполните:** `node scripts/create-user.mjs YOUR_CLERK_ID`
3. **Перезагрузите страницу** и попробуйте снова

## 📋 **Статус исправлений:**

- ✅ **Создан скрипт создания пользователя** (`scripts/create-user.mjs`)
- ✅ **Создан скрипт получения Clerk ID** (`scripts/get-clerk-id.mjs`)
- ✅ **Улучшена обработка ошибок** в API routes
- ✅ **Добавлены подробные сообщения об ошибках**
- ✅ **Обновлены все API routes** с лучшими ошибками

**Готово к исправлению ошибок аутентификации!** 🔧
