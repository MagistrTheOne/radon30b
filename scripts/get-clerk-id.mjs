import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getClerkId() {
  try {
    console.log('🔍 Получаем Clerk ID из браузера...')
    console.log('')
    console.log('📋 ИНСТРУКЦИЯ:')
    console.log('1. Откройте браузер и зайдите на http://localhost:3000')
    console.log('2. Войдите в аккаунт через Clerk')
    console.log('3. Откройте DevTools (F12)')
    console.log('4. В Console выполните:')
    console.log('   window.Clerk.user.id')
    console.log('5. Скопируйте полученный ID')
    console.log('6. Замените в scripts/create-user.mjs:')
    console.log('   const clerkId = "ВАШ_РЕАЛЬНЫЙ_CLERK_ID"')
    console.log('')
    console.log('💡 Или выполните в Console:')
    console.log('   console.log("Clerk ID:", window.Clerk.user.id)')
    console.log('')
    
    // Показываем текущих пользователей
    const users = await prisma.user.findMany({
      include: {
        subscriptionData: true
      }
    })
    
    console.log('📊 Текущие пользователи в БД:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. Clerk ID: ${user.clerkId}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Subscription: ${user.subscriptionData?.tier || 'none'}`)
      console.log('---')
    })
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getClerkId()
