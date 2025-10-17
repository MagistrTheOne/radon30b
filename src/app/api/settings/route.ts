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

    // Возвращаем настройки по умолчанию (в будущем можно добавить таблицу настроек)
    const defaultSettings = {
      theme: 'dark',
      language: 'ru',
      notifications: {
        email: true,
        push: true,
        sound: true
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      },
      ai: {
        personality: 'helpful',
        maxTokens: 2048,
        streaming: true
      }
    }

    return NextResponse.json(defaultSettings)

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Ошибка получения настроек' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { theme, language, notifications, privacy, ai } = body

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

    // В будущем можно добавить таблицу настроек в БД
    // Пока что просто возвращаем сохраненные настройки
    const savedSettings = {
      theme: theme || 'dark',
      language: language || 'ru',
      notifications: notifications || {
        email: true,
        push: true,
        sound: true
      },
      privacy: privacy || {
        profileVisibility: 'private',
        dataSharing: false
      },
      ai: ai || {
        personality: 'helpful',
        maxTokens: 2048,
        streaming: true
      }
    }

    return NextResponse.json(savedSettings)

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления настроек' },
      { status: 500 }
    )
  }
}
