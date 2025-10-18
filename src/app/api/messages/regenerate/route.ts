import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { callRadonAPIWithRetry } from '@/lib/radon-client'

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
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json(
        { error: 'ID сообщения обязателен' },
        { status: 400 }
      )
    }

    // Получаем сообщение для регенерации
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
        { error: 'Нет доступа к этому чату' },
        { status: 403 }
      )
    }

    // Проверяем, что это сообщение от пользователя
    if (message.role !== 'user') {
      return NextResponse.json(
        { error: 'Можно регенерировать только пользовательские сообщения' },
        { status: 400 }
      )
    }

    // Получаем контекст предыдущих сообщений
    const recentMessages = await prisma.message.findMany({
      where: {
        chatId: message.chatId,
        createdAt: {
          lt: message.createdAt
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Строим контекст для Radon AI
    const contextMessages = recentMessages.reverse()
    const contextPrompt = contextMessages
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'Пользователь' : 'Radon AI'}: ${msg.content}`)
      .join('\n')

    // Вызываем Radon AI API для регенерации ответа
    const radonResponse = await callRadonAPIWithRetry(message.content, {
      max_new_tokens: 512,
      temperature: 0.7,
      enable_functions: true,
      personality: 'helpful',
      conversation_id: message.chatId,
      user_id: userId
    })

    // Создаем новое сообщение от AI
    const newAiMessage = await prisma.message.create({
      data: {
        chatId: message.chatId,
        role: 'assistant',
        content: radonResponse.response,
        functionCalls: radonResponse.function_calls ? JSON.stringify(radonResponse.function_calls) : undefined,
        personalityUsed: radonResponse.personality_used || null,
        conversationId: radonResponse.conversation_id || null
      }
    })

    // Обновляем время последнего обновления чата
    await prisma.chat.update({
      where: { id: message.chatId },
      data: {}
    })

    // Возвращаем новое сообщение
    const formattedMessage = {
      id: newAiMessage.id,
      role: newAiMessage.role,
      content: newAiMessage.content,
      imageUrl: newAiMessage.imageUrl,
      audioUrl: newAiMessage.audioUrl,
      audioTranscription: newAiMessage.audioTranscription,
      audioDuration: newAiMessage.audioDuration,
      functionCalls: newAiMessage.functionCalls ? JSON.parse(newAiMessage.functionCalls as string) : undefined,
      personalityUsed: newAiMessage.personalityUsed,
      conversationId: newAiMessage.conversationId,
      createdAt: newAiMessage.createdAt.toISOString(),
      editedAt: newAiMessage.editedAt?.toISOString(),
      isEdited: newAiMessage.isEdited
    }

    return NextResponse.json(formattedMessage)

  } catch (error) {
    console.error('Error regenerating message:', error)
    return NextResponse.json(
      { error: 'Ошибка регенерации сообщения' },
      { status: 500 }
    )
  }
}
