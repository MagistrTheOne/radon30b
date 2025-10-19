import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'PONG!',
    timestamp: new Date().toISOString()
  })
}
