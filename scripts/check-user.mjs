import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 Проверяем пользователей в БД...')
    
    const users = await prisma.user.findMany({
      include: {
        subscriptionData: true
      }
    })

    console.log(`📊 Найдено ${users.length} пользователей:`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`)
      console.log(`   Clerk ID: ${user.clerkId}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Subscription: ${user.subscription}`)
      console.log(`   Has Subscription Data: ${user.subscriptionData ? 'Yes' : 'No'}`)
      if (user.subscriptionData) {
        console.log(`   Tier: ${user.subscriptionData.tier}`)
        console.log(`   Status: ${user.subscriptionData.status}`)
      }
      console.log('---')
    })

  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
