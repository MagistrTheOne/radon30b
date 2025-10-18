/**
 * Radon AI API Client v2.0.0
 * Интеграция с Production FastAPI Backend на H200 VM
 * API: Production FastAPI Backend (URL from environment)
 * Поддержка новых параметров: enable_functions, personality, conversation_id, user_id
 */

export interface RadonAPIOptions {
  max_new_tokens?: number
  temperature?: number
  stream?: boolean
  imageUrl?: string
  audioUrl?: string
  // Новые параметры API v2.0.0
  enable_functions?: boolean
  personality?: 'helpful' | 'creative' | 'technical'
  conversation_id?: string
  user_id?: string
}

export interface RadonAPIResponse {
  response: string
  tokens_used?: number
  error?: string
  // Новые поля API v2.0.0
  conversation_id?: string
  function_calls?: Array<{
    name: string
    arguments: Record<string, unknown>
  }>
  personality_used?: string
}

export interface RadonStreamChunk {
  content: string
  done: boolean
  error?: string
  // Новые поля для streaming API v2.0.0
  conversation_id?: string
  function_calls?: Array<{
    name: string
    arguments: Record<string, unknown>
  }>
  personality_used?: string
}

/**
 * Прямой вызов Radon AI API v2.0.0
 */
export async function callRadonAPI(
  prompt: string, 
  options: RadonAPIOptions = {}
): Promise<RadonAPIResponse> {
  const {
    max_new_tokens = 512,
    temperature = 0.7,
    stream = false,
    imageUrl,
    audioUrl,
    // Новые параметры API v2.0.0
    enable_functions = false,
    personality = 'helpful',
    conversation_id,
    user_id
  } = options

  // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'
  
  try {
    // Если есть мультимодальные данные, используем FormData
    if (imageUrl || audioUrl) {
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('max_new_tokens', max_new_tokens.toString())
      formData.append('temperature', temperature.toString())
      formData.append('stream', stream.toString())
      // Новые параметры API v2.0.0
      formData.append('enable_functions', enable_functions.toString())
      formData.append('personality', personality)
      if (conversation_id) formData.append('conversation_id', conversation_id)
      if (user_id) formData.append('user_id', user_id)
      
      if (imageUrl) {
        // Загружаем изображение по URL
        const imageResponse = await fetch(imageUrl)
        const imageBlob = await imageResponse.blob()
        formData.append('image', imageBlob, 'image.jpg')
      }
      
      if (audioUrl) {
        // Загружаем аудио по URL
        const audioResponse = await fetch(audioUrl)
        const audioBlob = await audioResponse.blob()
        formData.append('audio', audioBlob, 'audio.webm')
      }

      const response = await fetch(`${radonApiUrl}/chat`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Radon API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return parseRadonResponse(data)
    } else {
      // Обычный JSON запрос для текстовых сообщений
      const response = await fetch(`${radonApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          max_new_tokens,
          temperature,
          stream,
          // Новые параметры API v2.0.0
          enable_functions,
          personality,
          conversation_id,
          user_id
        })
      })

      if (!response.ok) {
        throw new Error(`Radon API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return parseRadonResponse(data)
    }

  } catch (error) {
    console.error('Radon API call failed:', error)
    
    // Возвращаем ошибку вместо мокового ответа
    throw new Error(`Ошибка обращения к Radon AI: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}

/**
 * Парсинг ответа от Radon API с поддержкой новых полей v2.0.0
 */
function parseRadonResponse(data: unknown): RadonAPIResponse {
  // Проверяем что data это объект
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format')
  }
  
  const responseData = data as Record<string, unknown>
  
  // Обработка ошибок
  if (responseData.error) {
    throw new Error(String(responseData.error))
  }

  // Если ответ содержит поле response
  if (responseData.response) {
    return {
      response: String(responseData.response),
      tokens_used: typeof responseData.tokens_used === 'number' ? responseData.tokens_used : undefined,
      // Новые поля API v2.0.0
      conversation_id: typeof responseData.conversation_id === 'string' ? responseData.conversation_id : undefined,
      function_calls: Array.isArray(responseData.function_calls) ? responseData.function_calls as Array<{name: string; arguments: Record<string, unknown>}> : undefined,
      personality_used: typeof responseData.personality_used === 'string' ? responseData.personality_used : undefined
    }
  }

  // Если ответ содержит поле text или content
  if (responseData.text) {
    return {
      response: String(responseData.text),
      tokens_used: typeof responseData.tokens_used === 'number' ? responseData.tokens_used : undefined,
      // Новые поля API v2.0.0
      conversation_id: typeof responseData.conversation_id === 'string' ? responseData.conversation_id : undefined,
      function_calls: Array.isArray(responseData.function_calls) ? responseData.function_calls as Array<{name: string; arguments: Record<string, unknown>}> : undefined,
      personality_used: typeof responseData.personality_used === 'string' ? responseData.personality_used : undefined
    }
  }

  if (responseData.content) {
    return {
      response: String(responseData.content),
      tokens_used: typeof responseData.tokens_used === 'number' ? responseData.tokens_used : undefined,
      // Новые поля API v2.0.0
      conversation_id: typeof responseData.conversation_id === 'string' ? responseData.conversation_id : undefined,
      function_calls: Array.isArray(responseData.function_calls) ? responseData.function_calls as Array<{name: string; arguments: Record<string, unknown>}> : undefined,
      personality_used: typeof responseData.personality_used === 'string' ? responseData.personality_used : undefined
    }
  }

  // Если весь ответ - это строка
  if (typeof data === 'string') {
    return {
      response: data
    }
  }

  // Fallback - попробуем найти любой текстовый контент
  const textContent = Object.values(responseData).find(value => 
    typeof value === 'string' && value.length > 0
  ) as string

  if (textContent) {
    return {
      response: textContent
    }
  }

  throw new Error('Неожиданный формат ответа от Radon API')
}

/**
 * Streaming вызов Radon AI API v2.0.0 через Server-Sent Events
 */
export async function streamRadonAPI(
  prompt: string,
  options: RadonAPIOptions = {}
): Promise<ReadableStream<RadonStreamChunk>> {
  const {
    max_new_tokens = 512,
    temperature = 0.7,
    enable_functions = false,
    personality = 'helpful',
    conversation_id,
    user_id
  } = options

  // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'

  try {
    const response = await fetch(`${radonApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        prompt,
        max_new_tokens,
        temperature,
        stream: true,
        // Новые параметры API v2.0.0
        enable_functions,
        personality,
        conversation_id,
        user_id
      })
    })

    if (!response.ok) {
      throw new Error(`Radon API streaming error: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('No response body for streaming')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              controller.enqueue({ content: '', done: true })
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data === '[DONE]') {
                  controller.enqueue({ content: '', done: true })
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.response || parsed.text || parsed.content || parsed.delta?.content || ''
                  
                  if (content) {
                    controller.enqueue({ 
                      content, 
                      done: false,
                      // Новые поля для streaming API v2.0.0
                      conversation_id: parsed.conversation_id,
                      function_calls: parsed.function_calls,
                      personality_used: parsed.personality_used
                    })
                  }
                } catch (parseError) {
                  // Игнорируем ошибки парсинга отдельных чанков
                  continue
                }
              }
            }
          }
        } catch (error) {
          controller.enqueue({ 
            content: '', 
            done: true, 
            error: error instanceof Error ? error.message : 'Streaming error' 
          })
          controller.close()
        }
      }
    })

  } catch (error) {
    console.error('Radon API streaming failed:', error)
    
    // Возвращаем ошибку вместо мокового ответа
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ 
          content: 'Извините, произошла ошибка при обращении к Radon AI. Пожалуйста, попробуйте позже.', 
          done: true 
        })
        controller.close()
      }
    })
  }
}

/**
 * Проверка доступности Radon API
 */
export async function checkRadonAPIHealth(): Promise<boolean> {
  try {
    // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'
    
    // Создаем AbortController для совместимости
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 секунд таймаут
    
    const response = await fetch(`${radonApiUrl}/health`, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.error('Radon API health check failed:', error)
    return false
  }
}

/**
 * Получение списка доступных функций
 */
export async function getRadonFunctions(): Promise<Array<{
  name: string
  description: string
  parameters: Record<string, unknown>
}>> {
  try {
    // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'
    
    // Создаем AbortController для совместимости
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${radonApiUrl}/functions`, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Functions API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.functions || []
  } catch (error) {
    console.error('Failed to fetch Radon functions:', error)
    return []
  }
}

/**
 * Получение списка доступных личностей
 */
export async function getRadonPersonalities(): Promise<Array<{
  id: string
  name: string
  description: string
}>> {
  try {
    // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'
    
    // Создаем AbortController для совместимости
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${radonApiUrl}/personalities`, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Personalities API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.personalities || []
  } catch (error) {
    console.error('Failed to fetch Radon personalities:', error)
    return []
  }
}

/**
 * Создание нового разговора
 */
export async function createRadonConversation(userId: string): Promise<{
  conversation_id: string
  created_at: string
}> {
  try {
    // Клиентские вызовы идут через Next.js API routes
  const radonApiUrl = '/api/radon'
    const response = await fetch(`${radonApiUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
      })
    })
    
    if (!response.ok) {
      throw new Error(`Conversation API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return {
      conversation_id: data.conversation_id,
      created_at: data.created_at
    }
  } catch (error) {
    console.error('Failed to create Radon conversation:', error)
    throw error
  }
}

/**
 * Retry wrapper для вызовов Radon API
 */
export async function callRadonAPIWithRetry(
  prompt: string,
  options: RadonAPIOptions = {},
  maxRetries: number = 3
): Promise<RadonAPIResponse> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callRadonAPI(prompt, options)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError || new Error('Max retries exceeded')
}