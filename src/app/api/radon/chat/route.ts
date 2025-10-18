import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const RADON_API_URL = process.env.RADON_API_URL

if (!RADON_API_URL) {
  throw new Error('RADON_API_URL environment variable is required')
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, max_new_tokens, temperature, personality, enable_functions, conversation_id } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Проксируем запрос к FastAPI backend
    const response = await fetch(`${RADON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_new_tokens: max_new_tokens || 512,
        temperature: temperature || 0.7,
        personality: personality || 'helpful',
        enable_functions: enable_functions || false,
        conversation_id,
        user_id: userId || 'test_user'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Radon API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Radon API error', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error calling Radon API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
