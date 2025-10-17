import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Получаем текущий месяц
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Подсчитываем сообщения за текущий месяц
    const messageCount = await prisma.message.count({
      where: {
        chat: {
          userId
        },
        role: 'user',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Получаем статистику использования токенов
    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      select: {
        count: true
      }
    })

    const totalTokensUsed = usageLogs.reduce((sum: number, log: { count: number }) => sum + log.count, 0)

    // Получаем подписку для определения лимитов
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    const tier = subscription?.tier || 'free'
    
    // Определяем лимиты в зависимости от тарифа
    const limits = {
      free: { messages: 100, tokens: 10000 },
      pro: { messages: 1000, tokens: 100000 },
      team: { messages: 5000, tokens: 500000 },
      enterprise: { messages: -1, tokens: -1 } // unlimited
    }

    const userLimits = limits[tier as keyof typeof limits]

    return NextResponse.json({
      messagesUsed: messageCount,
      messagesLimit: userLimits.messages,
      tokensUsed: totalTokensUsed,
      tokensLimit: userLimits.tokens,
      lastReset: startOfMonth.toISOString(),
      tier,
      period: {
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики использования' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { count = 1, action = 'message' } = body

    // Создаем запись об использовании
    const usageLog = await prisma.usageLog.create({
      data: {
        userId,
        action,
        count: count || 1
      }
    })

    return NextResponse.json({
      success: true,
      usageLog: {
        id: usageLog.id,
        action: usageLog.action,
        count: usageLog.count,
        date: usageLog.date.toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating usage log:', error)
    return NextResponse.json(
      { error: 'Ошибка создания записи использования' },
      { status: 500 }
    )
  }
}
