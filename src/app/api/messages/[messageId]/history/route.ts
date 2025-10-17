import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { userId } = await auth()
    const { messageId } = await params
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Получаем сообщение и проверяем доступ
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        chat: true,
        edits: {
          orderBy: {
            editedAt: 'desc'
          }
        }
      }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь имеет доступ к этому чату
    if (message.chat.userId !== userId) {
      return NextResponse.json(
        { error: 'Нет доступа к этому сообщению' },
        { status: 403 }
      )
    }

    // Форматируем историю редактирования
    const editHistory = message.edits.map(edit => ({
      id: edit.id,
      previousContent: edit.previousContent,
      editedAt: edit.editedAt.toISOString()
    }))

    return NextResponse.json({
      messageId: message.id,
      currentContent: message.content,
      isEdited: message.isEdited,
      editedAt: message.editedAt?.toISOString(),
      editHistory
    })

  } catch (error) {
    console.error('Error fetching message history:', error)
    return NextResponse.json(
      { error: 'Ошибка получения истории сообщения' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { userId } = await auth()
    const { messageId } = await params
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { newContent } = body

    if (!newContent || newContent.trim() === '') {
      return NextResponse.json(
        { error: 'Новое содержимое сообщения обязательно' },
        { status: 400 }
      )
    }

    // Получаем сообщение и проверяем доступ
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        chat: true
      }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь имеет доступ к этому чату
    if (message.chat.userId !== userId) {
      return NextResponse.json(
        { error: 'Нет доступа к этому сообщению' },
        { status: 403 }
      )
    }

    // Проверяем, что это сообщение от пользователя
    if (message.role !== 'user') {
      return NextResponse.json(
        { error: 'Можно редактировать только пользовательские сообщения' },
        { status: 400 }
      )
    }

    // Сохраняем предыдущее содержимое в историю
    await prisma.messageEdit.create({
      data: {
        messageId: message.id,
        previousContent: message.content
      }
    })

    // Обновляем сообщение
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent.trim(),
        isEdited: true,
        editedAt: new Date()
      }
    })

    return NextResponse.json({
      id: updatedMessage.id,
      content: updatedMessage.content,
      isEdited: updatedMessage.isEdited,
      editedAt: updatedMessage.editedAt?.toISOString()
    })

  } catch (error) {
    console.error('Error editing message:', error)
    return NextResponse.json(
      { error: 'Ошибка редактирования сообщения' },
      { status: 500 }
    )
  }
}
