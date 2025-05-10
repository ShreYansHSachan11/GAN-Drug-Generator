import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Make the DrugOn API call
    const response = await fetch('https://mtb.bioinf.med.uni-goettingen.de/drugon/v1/getDrugClassification/Olaparib', {
      headers: {
        'accept': '*/*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    const data = await response.json()

    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Return the drug classification data with cache control headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching from DrugOn API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drug classification data' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
} 