#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUser() {
  try {
    // Получаем Clerk ID из переменной окружения или параметра
    const clerkId = process.env.CLERK_USER_ID || process.argv[2]

    if (!clerkId) {
      console.error('❌ Нужно указать CLERK_USER_ID или передать как параметр')
      console.error('Использование: npm run create-user <clerk_id>')
      process.exit(1)
    }

    console.log(`🔍 Проверяем пользователя с Clerk ID: ${clerkId}`)

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      console.log(`✅ Пользователь уже существует: ${existingUser.id}`)
      console.log(`📧 Email: ${existingUser.email}`)
      console.log(`🎭 Роль: ${existingUser.role}`)
      return existingUser
    }

    // Создаем нового пользователя
    console.log('👤 Создаем нового пользователя...')

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email: `${clerkId}@example.com`, // Временный email
        role: 'user',
        subscriptionData: {
          create: {
            tier: 'free',
            requestsUsed: 0,
            requestsLimit: 10
          }
        }
      }
    })

    console.log(`✅ Пользователь создан: ${newUser.id}`)
    console.log(`📧 Email: ${newUser.email}`)
    console.log(`🎭 Роль: ${newUser.role}`)
    console.log(`💳 Подписка: ${newUser.subscriptionData?.tier}`)

    return newUser

  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем создание пользователя
createUser().catch(console.error)
