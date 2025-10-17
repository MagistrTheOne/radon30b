import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type = 'contact' } = body

    // Валидация обязательных полей
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Имя, email и сообщение обязательны' },
        { status: 400 }
      )
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный email адрес' },
        { status: 400 }
      )
    }

    // Создаем запись в базе данных
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || 'Обращение через сайт',
        message: message.trim(),
        type,
        status: 'new',
        userAgent: request.headers.get('user-agent') || 'unknown',
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
      }
    })

    // TODO: Отправить email уведомление администраторам
    // TODO: Отправить подтверждение пользователю

    return NextResponse.json({
      success: true,
      id: contactRequest.id,
      message: 'Ваше сообщение отправлено успешно. Мы свяжемся с вами в ближайшее время.'
    })

  } catch (error) {
    console.error('Error processing contact request:', error)
    return NextResponse.json(
      { error: 'Ошибка отправки сообщения. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
