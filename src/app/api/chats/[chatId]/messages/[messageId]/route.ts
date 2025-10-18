import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/chats/[chatId]/messages/[messageId] - редактировать сообщение
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string; messageId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { chatId, messageId } = await params
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Найти пользователя в БД по Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          details: 'Пользователь не найден в базе данных. Возможно, нужно выполнить синхронизацию пользователей.'
        },
        { status: 404 }
      )
    }

    // Проверить, что чат существует и принадлежит пользователю
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Найти сообщение
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        chatId: chatId
      }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Только пользовательские сообщения можно редактировать
    if (message.role !== 'user') {
      return NextResponse.json(
        { error: 'Can only edit user messages' },
        { status: 403 }
      )
    }

    // Сохранить предыдущую версию в истории редактирования
    await prisma.messageEdit.create({
      data: {
        messageId: messageId,
        previousContent: message.content
      }
    })

    // Обновить сообщение
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content.trim(),
        editedAt: new Date(),
        isEdited: true
      }
    })

    // Вернуть обновленное сообщение
    const formattedMessage = {
      id: updatedMessage.id,
      role: updatedMessage.role,
      content: updatedMessage.content,
      imageUrl: updatedMessage.imageUrl,
      createdAt: updatedMessage.createdAt.toISOString(),
      editedAt: updatedMessage.editedAt?.toISOString(),
      isEdited: updatedMessage.isEdited
    }

    return NextResponse.json(formattedMessage)

  } catch (error) {
    console.error('Error editing message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chats/[chatId]/messages/[messageId] - удалить сообщение
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string; messageId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { chatId, messageId } = await params

    // Найти пользователя в БД по Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          details: 'Пользователь не найден в базе данных. Возможно, нужно выполнить синхронизацию пользователей.'
        },
        { status: 404 }
      )
    }

    // Проверить, что чат существует и принадлежит пользователю
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Найти сообщение
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        chatId: chatId
      }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Только пользовательские сообщения можно удалять
    if (message.role !== 'user') {
      return NextResponse.json(
        { error: 'Can only delete user messages' },
        { status: 403 }
      )
    }

    // Удалить сообщение (история редактирования удалится каскадно)
    await prisma.message.delete({
      where: { id: messageId }
    })

    return NextResponse.json({ message: 'Message deleted successfully' })

  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
