import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Wait for 10 seconds
  await new Promise(resolve => setTimeout(resolve, 10000))

  // Return success response
  return NextResponse.json(
    { message: 'Drug candidates generated successfully' },
    { status: 200 }
  )
} 