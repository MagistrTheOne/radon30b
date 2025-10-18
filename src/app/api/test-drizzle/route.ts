import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: 'Drizzle API работает!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in test API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
