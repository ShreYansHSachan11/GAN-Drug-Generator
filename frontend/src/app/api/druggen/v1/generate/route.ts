import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Make the DrugOn API call
    const response = await fetch('https://mtb.bioinf.med.uni-goettingen.de/drugon/v1/getDrugClassification/Olaparib', {
      headers: {
        'accept': '*/*'
      }
    })
    const data = await response.json()

    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Return the drug classification data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from DrugOn API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drug classification data' },
      { status: 500 }
    )
  }
} 