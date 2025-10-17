import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем, является ли пользователь администратором
    const adminUser = await prisma.adminUser.findUnique({
      where: { userId: clerkUserId }
    })

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Получаем реальную статистику
    const [
      totalUsers,
      totalTeams,
      activeSubscriptions,
      totalMessages,
      totalChats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.subscription.count({
        where: { status: 'active' }
      }),
      prisma.message.count(),
      prisma.chat.count()
    ])

    // Подсчитываем пользователей за последние 30 дней
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newUsersLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Подсчитываем активных пользователей за последние 24 часа
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    const dailyActiveUsers = await prisma.user.count({
      where: {
        chats: {
          some: {
            messages: {
              some: {
                createdAt: {
                  gte: twentyFourHoursAgo
                }
              }
            }
          }
        }
      }
    })

    // Подсчитываем подписки по типам
    const subscriptionStats = await prisma.subscription.groupBy({
      by: ['tier'],
      _count: {
        tier: true
      }
    })

    const subscriptionBreakdown = subscriptionStats.reduce((acc, stat) => {
      acc[stat.tier] = stat._count.tier
      return acc
    }, {} as Record<string, number>)

    // Рассчитываем рост (примерно)
    const monthlyGrowth = totalUsers > 0 ? (newUsersLast30Days / totalUsers) * 100 : 0

    const stats = {
      totalUsers,
      totalTeams,
      totalRevenue: 0, // В будущем можно добавить таблицу платежей
      activeSubscriptions,
      dailyActiveUsers,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      totalMessages,
      totalChats,
      subscriptionBreakdown
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    )
  }
}
