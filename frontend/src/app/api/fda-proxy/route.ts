import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Make the FDA API call from the server
    const response = await fetch('https://api.fda.gov/drug/label.json?limit=1')
    const data = await response.json()

    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Return the FDA data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from FDA API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FDA data' },
      { status: 500 }
    )
  }
} 