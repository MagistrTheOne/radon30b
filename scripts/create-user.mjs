import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUser() {
  try {
    // Замените на ваш реальный Clerk ID и email
    const clerkId = 'user_2your_clerk_id_here' // Нужно получить из браузера
    const email = 'your_email@example.com' // Ваш email
    
    console.log('🔍 Создаем пользователя...')
    
    // Проверяем, есть ли уже пользователь
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })
    
    if (existingUser) {
      console.log('✅ Пользователь уже существует:', existingUser.email)
      return
    }
    
    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        subscription: 'free'
      }
    })
    
    console.log('✅ Пользователь создан:', user.email)
    
    // Создаем подписку
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'free',
        status: 'active'
      }
    })
    
    console.log('✅ Подписка создана:', subscription.tier)
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
