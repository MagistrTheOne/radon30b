import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const RADON_API_URL = process.env.RADON_API_URL

if (!RADON_API_URL) {
  throw new Error('RADON_API_URL environment variable is required')
}

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Проксируем запрос к FastAPI backend
    const response = await fetch(`${RADON_API_URL}/functions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
