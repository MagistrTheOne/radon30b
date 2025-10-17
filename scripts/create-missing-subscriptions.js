import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createMissingSubscriptions() {
  try {
    console.log('🔍 Поиск пользователей без подписок...')
    
    // Найти пользователей без подписок
    const usersWithoutSubscriptions = await prisma.user.findMany({
      where: {
        subscriptionData: null
      }
    })

    console.log(`📊 Найдено ${usersWithoutSubscriptions.length} пользователей без подписок`)

    if (usersWithoutSubscriptions.length === 0) {
      console.log('✅ Все пользователи уже имеют подписки')
      return
    }

    // Создать бесплатные подписки для всех пользователей без подписок
    const subscriptions = usersWithoutSubscriptions.map(user => ({
      userId: user.id,
      tier: 'free',
      status: 'active'
    }))

    const result = await prisma.subscription.createMany({
      data: subscriptions,
      skipDuplicates: true
    })

    console.log(`✅ Создано ${result.count} подписок`)
    console.log('🎉 Миграция завершена успешно!')

  } catch (error) {
    console.error('❌ Ошибка при создании подписок:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMissingSubscriptions()
