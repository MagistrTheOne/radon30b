import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/chats/[chatId] - получить чат с сообщениями
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { chatId } = await params

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

    // Найти чат с сообщениями
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Преобразовать сообщения в формат, ожидаемый фронтендом
    const formattedMessages = chat.messages.map((message: { id: string; role: string; content: string; imageUrl: string | null; audioUrl: string | null; audioTranscription: string | null; audioDuration: number | null; createdAt: Date; editedAt: Date | null; isEdited: boolean }) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      imageUrl: message.imageUrl,
      createdAt: message.createdAt.toISOString(),
      editedAt: message.editedAt?.toISOString(),
      isEdited: message.isEdited
    }))

    // Вернуть чат с сообщениями
    const formattedChat = {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      messageCount: chat.messages.length,
      messages: formattedMessages
    }

    return NextResponse.json(formattedChat)

  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/chats/[chatId] - обновить название чата
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { chatId } = await params
    const body = await request.json()
    const { title } = body

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
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

    // Обновить чат
    const chat = await prisma.chat.updateMany({
      where: {
        id: chatId,
        userId: user.id
      },
      data: {
        title: title.trim()
      }
    })

    if (chat.count === 0) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Получить обновленный чат
    const updatedChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id
      },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    if (!updatedChat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Вернуть в формате, ожидаемом фронтендом
    const formattedChat = {
      id: updatedChat.id,
      title: updatedChat.title,
      createdAt: updatedChat.createdAt.toISOString(),
      messageCount: updatedChat._count.messages
    }

    return NextResponse.json(formattedChat)

  } catch (error) {
    console.error('Error updating chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chats/[chatId] - удалить чат
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { chatId } = await params

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

    // Удалить чат (сообщения удалятся каскадно)
    const deletedChat = await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userId: user.id
      }
    })

    if (deletedChat.count === 0) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Chat deleted successfully' })

  } catch (error) {
    console.error('Error deleting chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
