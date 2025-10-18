import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const RADON_API_URL = process.env.RADON_API_URL

if (!RADON_API_URL) {
  throw new Error('RADON_API_URL environment variable is required')
}

/**
 * POST /api/radon/multimodal - Мультимодальный чат с Radon AI
 * Поддерживает: текст, изображения, аудио, видео
 * Основан на Qwen3-Omni-30B-A3B-Instruct
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Извлекаем данные
    const text = formData.get('text') as string
    const image = formData.get('image') as File | null
    const audio = formData.get('audio') as File | null
    const video = formData.get('video') as File | null
    const personality = formData.get('personality') as string || 'helpful'
    const conversation_id = formData.get('conversation_id') as string
    const enable_functions = formData.get('enable_functions') === 'true'
    const response_format = formData.get('response_format') as string || 'text' // text, speech, both

    if (!text && !image && !audio && !video) {
      return NextResponse.json(
        { error: 'At least one input (text, image, audio, or video) is required' },
        { status: 400 }
      )
    }

    // Подготавливаем multipart/form-data для Radon API
    const radonFormData = new FormData()
    
    // Добавляем текстовый промпт
    if (text) {
      radonFormData.append('text', text)
    }
    
    // Добавляем изображение
    if (image) {
      radonFormData.append('image', image)
    }
    
    // Добавляем аудио
    if (audio) {
      radonFormData.append('audio', audio)
    }
    
    // Добавляем видео
    if (video) {
      radonFormData.append('video', video)
    }
    
    // Добавляем параметры
    radonFormData.append('personality', personality)
    radonFormData.append('conversation_id', conversation_id || `conv_${Date.now()}`)
    radonFormData.append('user_id', userId)
    radonFormData.append('enable_functions', enable_functions.toString())
    radonFormData.append('response_format', response_format)
    radonFormData.append('max_new_tokens', '1024')
    radonFormData.append('temperature', '0.7')

    // Отправляем запрос к Radon API
    const response = await fetch(`${RADON_API_URL}/multimodal`, {
      method: 'POST',
      body: radonFormData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Radon Multimodal API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Radon API error', details: errorText },
        { status: response.status }
      )
    }

    // Обрабатываем ответ в зависимости от формата
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data)
    } else if (contentType?.includes('audio/')) {
      // Возвращаем аудио ответ
      const audioBuffer = await response.arrayBuffer()
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Disposition': 'attachment; filename="radon_response.wav"'
        }
      })
    } else {
      // Текстовый ответ
      const text = await response.text()
      return NextResponse.json({ response: text })
    }

  } catch (error) {
    console.error('Error calling Radon Multimodal API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/radon/multimodal - Получить информацию о поддерживаемых форматах
 */
export async function GET() {
  return NextResponse.json({
    supported_inputs: {
      text: {
        description: "Текстовые сообщения",
        max_length: 8192
      },
      image: {
        description: "Изображения (PNG, JPEG, WebP)",
        max_size: "10MB",
        formats: ["png", "jpeg", "jpg", "webp"]
      },
      audio: {
        description: "Аудио файлы (WAV, MP3, M4A)",
        max_size: "25MB",
        formats: ["wav", "mp3", "m4a", "flac"],
        languages: ["ru", "en", "zh", "ja", "ko", "de", "fr", "es", "it", "pt"]
      },
      video: {
        description: "Видео файлы (MP4, AVI, MOV)",
        max_size: "100MB",
        formats: ["mp4", "avi", "mov", "mkv"],
        max_duration: "10 minutes"
      }
    },
    supported_outputs: {
      text: "Текстовые ответы",
      speech: "Голосовые ответы (WAV)",
      both: "Текст + голос одновременно"
    },
    personalities: [
      "helpful", "creative", "analytical", "friendly", "professional"
    ],
    model_info: {
      base_model: "Qwen3-Omni-30B-A3B-Instruct",
      capabilities: [
        "Multimodal understanding",
        "Real-time speech generation",
        "Cross-lingual support",
        "Function calling",
        "Streaming responses"
      ]
    }
  })
}
