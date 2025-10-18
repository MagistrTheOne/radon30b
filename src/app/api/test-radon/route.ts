import { NextRequest, NextResponse } from 'next/server'

const RADON_API_URL = process.env.RADON_API_URL

if (!RADON_API_URL) {
  throw new Error('RADON_API_URL environment variable is required')
}

/**
 * POST /api/test-radon - Тестовый endpoint для Radon AI без авторизации
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, personality = 'helpful', enable_functions = true } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('🚀 Тестируем Radon AI с промптом:', prompt)

    // Проксируем запрос к FastAPI backend
    const response = await fetch(`${RADON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_new_tokens: 1024,
        temperature: 0.7,
        personality,
        enable_functions,
        conversation_id: `test_${Date.now()}`,
        user_id: 'test_user'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Radon API error:', response.status, errorText)
      return NextResponse.json(
        { 
          error: 'Radon API error', 
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Radon AI ответ получен:', data)
    
    return NextResponse.json({
      success: true,
      prompt,
      response: data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error calling Radon API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/test-radon - Информация о тестовом endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Radon AI Test Endpoint',
    description: 'Тестовый endpoint для проверки работы Radon AI',
    usage: {
      method: 'POST',
      body: {
        prompt: 'string (required)',
        personality: 'string (optional, default: helpful)',
        enable_functions: 'boolean (optional, default: true)'
      }
    },
    personalities: ['helpful', 'creative', 'analytical', 'friendly', 'professional'],
    model: 'Qwen3-Omni-30B-A3B-Instruct',
    capabilities: [
      'Multimodal understanding',
      'Real-time responses',
      'Function calling',
      '119 text languages',
      '19 speech input languages',
      '10 speech output languages'
    ]
  })
}
