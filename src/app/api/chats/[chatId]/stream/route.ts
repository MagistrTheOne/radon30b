import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { streamRadonAPI } from '@/lib/radon-client'

/**
 * POST /api/chats/[chatId]/stream - стримить ответы от Radon AI в реальном времени
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new Response(
        'data: {"error": "Unauthorized"}\n\n',
        {
          status: 401,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        }
      )
    }

    const { chatId } = await params
    const body = await request.json()
    const { content, imageUrl } = body

    if (!content || typeof content !== 'string') {
      return new Response(
        'data: {"error": "Content is required"}\n\n',
        { 
          status: 400,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        }
      )
    }

    // Найти пользователя в БД по Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return new Response(
        'data: {"error": "User not found", "details": "Пользователь не найден в базе данных. Возможно, нужно выполнить синхронизацию пользователей."}\n\n',
        { 
          status: 404,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        }
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
      return new Response(
        'data: {"error": "Chat not found"}\n\n',
        { 
          status: 404,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        }
      )
    }

    // Создать сообщение пользователя
    const userMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        role: 'user',
        content: content.trim(),
        imageUrl: imageUrl || null
      }
    })

    // Создать временное сообщение AI для streaming
    const tempAiMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        role: 'assistant',
        content: '' // Будет заполнено по мере стриминга
      }
    })

    // Создать ReadableStream для SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Отправить начальное сообщение
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                messageId: tempAiMessage.id,
                content: '',
                done: false 
              })}\n\n`
            )
          )

          // Получить стрим от Radon API v2.0.0 с новыми параметрами
          const radonStream = await streamRadonAPI(content, {
            max_new_tokens: 512,
            temperature: 0.7,
            // Новые параметры API v2.0.0
            enable_functions: true, // Включаем function calling
            personality: 'helpful', // Режим общения
            conversation_id: chatId, // Используем chatId как conversation_id
            user_id: userId // ID пользователя из Clerk
          })

          const reader = radonStream.getReader()
          let fullResponse = ''

          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) {
                break
              }

              if (value.error) {
                // Ошибка в стриме
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ 
                      error: value.error,
                      done: true 
                    })}\n\n`
                  )
                )
                break
              }

              if (value.content) {
                fullResponse += value.content
                
                // Отправить чанк клиенту
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ 
                      messageId: tempAiMessage.id,
                      content: value.content,
                      done: false 
                    })}\n\n`
                  )
                )
              }

              if (value.done) {
                break
              }
            }
          } finally {
            reader.releaseLock()
          }

          // Обновить сообщение AI с полным ответом
          await prisma.message.update({
            where: { id: tempAiMessage.id },
            data: { content: fullResponse }
          })

          // Обновить время последнего обновления чата
          await prisma.chat.update({
            where: { id: chatId },
            data: {}
          })

          // Отправить финальное сообщение
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                messageId: tempAiMessage.id,
                content: '',
                done: true,
                fullResponse: fullResponse
              })}\n\n`
            )
          )

          controller.close()

        } catch (error) {
          console.error('Streaming error:', error)
          
          // Отправить сообщение об ошибке
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Streaming error',
                done: true 
              })}\n\n`
            )
          )
          
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Error in streaming endpoint:', error)
    
    return new Response(
      `data: ${JSON.stringify({ 
        error: 'Internal server error',
        done: true 
      })}\n\n`,
      { 
        status: 500,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      }
    )
  }
}
