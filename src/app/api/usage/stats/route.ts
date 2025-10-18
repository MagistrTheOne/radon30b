import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Найти пользователя в БД по Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Получить подписку пользователя
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Подписка не найдена' },
        { status: 404 }
      )
    }

    // Получить статистику использования за текущий день
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Подсчитать общее количество запросов
    const totalRequests = usageLogs.reduce((sum, log) => sum + log.count, 0)

    // Определить лимиты по подписке
    const limits = {
      free: 10,
      pro: 100,
      enterprise: 1000
    }

    const limit = limits[subscription.tier as keyof typeof limits] || limits.free

    // Получить статистику за последние 7 дней для графика
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyUsage = await prisma.usageLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: weekAgo
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Группировать по дням
    const dailyBreakdown = weeklyUsage.reduce((acc, log) => {
      const date = log.date.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += log.count
      return acc
    }, {} as Record<string, number>)

    // Заполнить пропущенные дни нулями
    const dailyBreakdownArray = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyBreakdownArray.push({
        date: dateStr,
        requests: dailyBreakdown[dateStr] || 0
      })
    }

    return NextResponse.json({
      used: totalRequests,
      limit,
      period: 'сегодня',
      dailyBreakdown: dailyBreakdownArray,
      subscription: {
        tier: subscription.tier,
        status: subscription.status
      }
    })

  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  }
}
