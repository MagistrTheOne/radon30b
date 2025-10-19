import { NextRequest, NextResponse } from 'next/server'

const RADON_API_URL = process.env.RADON_API_URL || 'http://213.219.215.235:8000'

/**
 * GET /api/radon/health - проверка статуса Radon AI backend
 */
export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${RADON_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Backend недоступен: ${response.status}`,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'ok',
      backend: 'Radon AI',
      version: data.version || 'unknown',
      timestamp: new Date().toISOString(),
      ...data
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Не удалось подключиться к backend',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}