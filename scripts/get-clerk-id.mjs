#!/usr/bin/env node

// Скрипт для получения Clerk ID текущего пользователя
// Запускается в браузере через консоль

console.log(`
🆔 **Как получить ваш Clerk ID:**

1. Откройте браузер и зайдите на http://localhost:3000
2. Авторизуйтесь через Clerk (Google/GitHub)
3. Откройте DevTools (F12)
4. Перейдите во вкладку Console
5. Выполните следующий код:

\`\`\`javascript
// Получить Clerk ID
window.Clerk.user.id
\`\`\`

6. Скопируйте полученный ID и используйте в команде:
\`\`\`bash
node scripts/create-user.mjs YOUR_CLERK_ID_HERE
\`\`\`

📝 **Пример:**
\`\`\`bash
node scripts/create-user.mjs user_2your_clerk_id_here
\`\`\`

🔧 **Или установите переменную окружения:**
\`\`\`bash
export CLERK_USER_ID=user_2your_clerk_id_here
node scripts/create-user.mjs
\`\`\`
`)