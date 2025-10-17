import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { callRadonAPIWithRetry } from '@/lib/radon-client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

/**
 * POST /api/chats/[chatId]/messages - отправить сообщение и получить ответ от Radon AI
 */
export async function POST(
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
    
    // Проверяем, является ли запрос FormData (для мультимодальных данных)
    const contentType = request.headers.get('content-type') || ''
    let content: string
    let imageUrl: string | undefined
    let audioUrl: string | undefined
    let audioDuration: number | undefined

    if (contentType.includes('multipart/form-data')) {
      // Обработка FormData с аудио/изображениями
      const formData = await request.formData()
      content = formData.get('content') as string
      const imageFile = formData.get('image') as File | null
      const audioFile = formData.get('audio') as File | null

      if (!content) {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        )
      }

      // Сохраняем изображение
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `image-${Date.now()}-${Math.random().toString(36).substring(7)}.${imageFile.name.split('.').pop()}`
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'images')
        
        try {
          await mkdir(uploadDir, { recursive: true })
          await writeFile(join(uploadDir, fileName), buffer)
          imageUrl = `/uploads/images/${fileName}`
        } catch (error) {
          console.error('Error saving image:', error)
        }
      }

      // Сохраняем аудио
      if (audioFile) {
        const bytes = await audioFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.webm`
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'audio')
        
        try {
          await mkdir(uploadDir, { recursive: true })
          await writeFile(join(uploadDir, fileName), buffer)
          audioUrl = `/uploads/audio/${fileName}`
          
          // Получаем длительность аудио из метаданных файла
          try {
            const { extractAudioMetadata } = await import('@/lib/audio-metadata')
            const audioMetadata = await extractAudioMetadata(audioFile)
            audioDuration = audioMetadata.duration
          } catch (error) {
            console.error('Error extracting audio metadata:', error)
            // Fallback к примерному значению
            audioDuration = Math.round(audioFile.size / 32000) // примерная длительность
          }
        } catch (error) {
          console.error('Error saving audio:', error)
        }
      }
    } else {
      // Обработка обычного JSON запроса
      const body = await request.json()
      content = body.content
      imageUrl = body.imageUrl
    }

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
        { error: 'User not found' },
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

    // Создать сообщение пользователя
    const userMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        role: 'user',
        content: content.trim(),
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
        audioDuration: audioDuration || null
      }
    })

    // Получить контекст чата для Radon AI
    const recentMessages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: { createdAt: 'desc' },
      take: 10 // Последние 10 сообщений для контекста
    })

    // Построить контекст для Radon AI
    const contextMessages = recentMessages.reverse()
    const contextPrompt = contextMessages
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'Пользователь' : 'Radon AI'}: ${msg.content}`)
      .join('\n')

    // Вызвать Radon AI API v2.0.0 с новыми параметрами
    const radonResponse = await callRadonAPIWithRetry(content, {
      max_new_tokens: 512,
      temperature: 0.7,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
      // Новые параметры API v2.0.0
      enable_functions: true, // Включаем function calling
      personality: 'helpful', // Режим общения
      conversation_id: chatId, // Используем chatId как conversation_id
      user_id: userId // ID пользователя из Clerk
    })

    // Создать сообщение от AI с новыми полями API v2.0.0
    const aiMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        role: 'assistant',
        content: radonResponse.response,
        // Новые поля API v2.0.0
        functionCalls: radonResponse.function_calls ? JSON.stringify(radonResponse.function_calls) : undefined,
        personalityUsed: radonResponse.personality_used || null,
        conversationId: radonResponse.conversation_id || null
      }
    })

    // Обновить время последнего обновления чата
    await prisma.chat.update({
      where: { id: chatId },
      data: {}
    })

    // Вернуть ответ AI в формате, ожидаемом фронтендом
    const formattedMessage = {
      id: aiMessage.id,
      role: aiMessage.role,
      content: aiMessage.content,
      imageUrl: aiMessage.imageUrl,
      audioUrl: aiMessage.audioUrl,
      audioTranscription: aiMessage.audioTranscription,
      audioDuration: aiMessage.audioDuration,
      // Новые поля API v2.0.0
      functionCalls: aiMessage.functionCalls ? JSON.parse(aiMessage.functionCalls as string) : undefined,
      personalityUsed: aiMessage.personalityUsed,
      conversationId: aiMessage.conversationId,
      createdAt: aiMessage.createdAt.toISOString(),
      editedAt: aiMessage.editedAt?.toISOString(),
      isEdited: aiMessage.isEdited
    }

    return NextResponse.json(formattedMessage)

  } catch (error) {
    console.error('Error sending message:', error)
    
    // Если ошибка связана с Radon API, попробуем вернуть fallback ответ
    if (error instanceof Error && error.message.includes('Radon API')) {
      try {
        const { chatId } = await params
        const body = await request.json()
        const { content } = body

        // Создать fallback сообщение от AI
        const fallbackMessage = await prisma.message.create({
          data: {
            chatId: chatId,
            role: 'assistant',
            content: `Извините, в данный момент Radon AI недоступен. Ваше сообщение: "${content}" - получено и будет обработано, как только сервис восстановится.`
          }
        })

        const formattedMessage = {
          id: fallbackMessage.id,
          role: fallbackMessage.role,
          content: fallbackMessage.content,
          imageUrl: fallbackMessage.imageUrl,
          createdAt: fallbackMessage.createdAt.toISOString(),
          editedAt: fallbackMessage.editedAt?.toISOString(),
          isEdited: fallbackMessage.isEdited
        }

        return NextResponse.json(formattedMessage)
      } catch (fallbackError) {
        console.error('Fallback message creation failed:', fallbackError)
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
