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

    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Подписка не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: subscription.id,
      userId: subscription.userId,
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString()
    })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Ошибка получения подписки' },
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
    const { tier, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd } = body

    // Проверяем, есть ли уже подписка
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (existingSubscription) {
      // Обновляем существующую подписку
      const updatedSubscription = await prisma.subscription.update({
        where: { userId },
        data: {
          tier,
          status: 'active',
          stripeCustomerId,
          stripeSubscriptionId,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        id: updatedSubscription.id,
        userId: updatedSubscription.userId,
        tier: updatedSubscription.tier,
        status: updatedSubscription.status,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString() || null,
        stripeCustomerId: updatedSubscription.stripeCustomerId,
        stripeSubscriptionId: updatedSubscription.stripeSubscriptionId,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString()
      })
    } else {
      // Создаем новую подписку
      const newSubscription = await prisma.subscription.create({
        data: {
          userId,
          tier,
          status: 'active',
          stripeCustomerId,
          stripeSubscriptionId,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null
        }
      })

      return NextResponse.json({
        id: newSubscription.id,
        userId: newSubscription.userId,
        tier: newSubscription.tier,
        status: newSubscription.status,
        currentPeriodEnd: newSubscription.currentPeriodEnd?.toISOString() || null,
        stripeCustomerId: newSubscription.stripeCustomerId,
        stripeSubscriptionId: newSubscription.stripeSubscriptionId,
        createdAt: newSubscription.createdAt.toISOString(),
        updatedAt: newSubscription.updatedAt.toISOString()
      })
    }

  } catch (error) {
    console.error('Error creating/updating subscription:', error)
    return NextResponse.json(
      { error: 'Ошибка создания/обновления подписки' },
      { status: 500 }
    )
  }
}
