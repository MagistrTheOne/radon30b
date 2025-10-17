const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateClerkId() {
  try {
    const email = 'magistrtheone@gmail.com'
    
    console.log('🔄 Обновление Clerk ID для пользователя...')
    console.log('📧 Email:', email)
    console.log('')
    console.log('После авторизации через Clerk Google:')
    console.log('1. Скопируйте ваш Clerk User ID из адресной строки браузера')
    console.log('2. Запустите команду: node scripts/update-clerk-id.js YOUR_CLERK_ID')
    console.log('')
    
    const clerkId = process.argv[2]
    
    if (!clerkId) {
      console.log('❌ Ошибка: Не указан Clerk ID')
      console.log('Использование: node scripts/update-clerk-id.js YOUR_CLERK_ID')
      return
    }
    
    // Обновляем Clerk ID пользователя
    const user = await prisma.user.update({
      where: { email },
      data: { 
        clerkId,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Clerk ID обновлен успешно!')
    console.log('👤 Пользователь:', user.email)
    console.log('🆔 Clerk ID:', user.clerkId)
    console.log('💎 Подписка:', user.subscription)
    
    // Проверяем права администратора
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    })
    
    if (adminUser) {
      console.log('👑 Права администратора:', adminUser.role)
      console.log('🔐 Разрешения:', JSON.parse(adminUser.permissions))
    }
    
    console.log('')
    console.log('🎉 ГОТОВО! Теперь вы можете войти в систему с полными правами Owner!')
    
  } catch (error) {
    console.error('❌ Ошибка обновления Clerk ID:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateClerkId()
