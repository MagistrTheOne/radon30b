import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserClerkId() {
  try {
    console.log('🔍 Обновляем Clerk ID пользователя...')
    console.log('')
    console.log('📋 ИНСТРУКЦИЯ:')
    console.log('1. Откройте браузер и зайдите на http://localhost:3000')
    console.log('2. Войдите в аккаунт через Clerk')
    console.log('3. Откройте DevTools (F12)')
    console.log('4. В Console выполните:')
    console.log('   window.Clerk.user.id')
    console.log('5. Скопируйте полученный ID')
    console.log('6. Замените NEW_CLERK_ID в этом скрипте')
    console.log('')
    
    // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ CLERK ID
    const NEW_CLERK_ID = 'user_2your_clerk_id_here' // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID
    const EMAIL = 'magistrtheone@gmail.com'
    
    if (NEW_CLERK_ID === 'user_2your_clerk_id_here') {
      console.log('❌ ОШИБКА: Замените NEW_CLERK_ID на ваш реальный Clerk ID!')
      console.log('')
      console.log('💡 Получите ID из браузера:')
      console.log('   window.Clerk.user.id')
      return
    }
    
    // Найти пользователя по email
    const user = await prisma.user.findFirst({
      where: { email: EMAIL }
    })
    
    if (!user) {
      console.log('❌ Пользователь не найден с email:', EMAIL)
      return
    }
    
    console.log('📊 Найден пользователь:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Старый Clerk ID: ${user.clerkId}`)
    console.log(`   Новый Clerk ID: ${NEW_CLERK_ID}`)
    console.log('')
    
    // Обновить Clerk ID
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { clerkId: NEW_CLERK_ID }
    })
    
    console.log('✅ Пользователь обновлен!')
    console.log(`   Новый Clerk ID: ${updatedUser.clerkId}`)
    console.log('')
    console.log('🎉 Теперь API routes должны работать!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserClerkId()
