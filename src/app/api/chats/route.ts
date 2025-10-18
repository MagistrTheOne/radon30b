import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/chats - получить список чатов текущего пользователя
 */
export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Найти пользователя в БД по Clerk ID
    let user
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    } catch (dbError) {
      console.error('❌ Ошибка подключения к базе данных:', dbError)
      return NextResponse.json(
        {
          error: 'Database connection error',
          details: 'База данных временно недоступна. Попробуйте позже.'
        },
        { status: 503 }
      )
    }

    if (!user) {
      // Автоматически создаем пользователя при первом запросе
      console.log(`👤 Создаем пользователя для Clerk ID: ${userId}`)
      try {
        // Получаем данные пользователя из Clerk
        const clerkUser = await currentUser()
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@radon.ai`
        const userName = clerkUser?.firstName && clerkUser?.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser?.firstName || 'Пользователь'

        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: userEmail,
            name: userName,
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
        console.log(`✅ Пользователь создан: ${newUser.id} (${userEmail})`)
        // Обновляем переменную user для дальнейшего использования
        user = newUser
      } catch (createError) {
        console.error('❌ Ошибка создания пользователя:', createError)
        return NextResponse.json(
          {
            error: 'Failed to create user',
            details: 'Не удалось автоматически создать пользователя. Попробуйте создать его вручную.'
          },
          { status: 500 }
        )
      }
    }

    // Получить чаты пользователя с подсчетом сообщений
    const chats = await prisma.chat.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    // Преобразовать в формат, ожидаемый фронтендом
    const formattedChats = chats.map((chat: { id: string; title: string; createdAt: Date; _count: { messages: number } }) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      messageCount: chat._count.messages
    }))

    return NextResponse.json(formattedChats)

  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/chats - создать новый чат
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title } = body

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Найти пользователя в БД по Clerk ID
    let user
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    } catch (dbError) {
      console.error('❌ Ошибка подключения к базе данных:', dbError)
      return NextResponse.json(
        {
          error: 'Database connection error',
          details: 'База данных временно недоступна. Попробуйте позже.'
        },
        { status: 503 }
      )
    }

    if (!user) {
      // Автоматически создаем пользователя при первом запросе
      console.log(`👤 Создаем пользователя для Clerk ID: ${userId}`)
      try {
        // Получаем данные пользователя из Clerk
        const clerkUser = await currentUser()
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@radon.ai`
        const userName = clerkUser?.firstName && clerkUser?.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser?.firstName || 'Пользователь'

        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: userEmail,
            name: userName,
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
        console.log(`✅ Пользователь создан: ${newUser.id} (${userEmail})`)
        // Обновляем переменную user для дальнейшего использования
        user = newUser
      } catch (createError) {
        console.error('❌ Ошибка создания пользователя:', createError)
        return NextResponse.json(
          {
            error: 'Failed to create user',
            details: 'Не удалось автоматически создать пользователя. Попробуйте создать его вручную.'
          },
          { status: 500 }
        )
      }
    }

    // Создать новый чат
    const chat = await prisma.chat.create({
      data: {
        userId: user!.id,
        title: title.trim()
      }
    })

    // Вернуть в формате, ожидаемом фронтендом
    const formattedChat = {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      messageCount: 0
    }

    return NextResponse.json(formattedChat, { status: 201 })

  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}