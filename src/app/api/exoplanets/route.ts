import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source') || 'nasa'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    let data: Record<string, unknown>[] = []
    
    if (source === 'mongodb') {
      // Fetch from MongoDB backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/exoplanets/all?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`)
      }
      
      data = await response.json()
    } else {
      // Fetch from NASA API
      const nasaUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars+where+default_flag=1&format=json`
      const nasaResponse = await fetch(nasaUrl)
      
      if (!nasaResponse.ok) {
        throw new Error(`NASA API request failed: ${nasaResponse.status}`)
      }
      
      const nasaData = await nasaResponse.json()
      
      // Apply pagination to NASA data
      data = nasaData.slice(offset, offset + limit)
    }

    return NextResponse.json({
      success: true,
      source,
      count: data.length,
      data,
      pagination: {
        limit,
        offset,
        total: data.length
      },
      fetchedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Exoplanets API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'api'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters } = body

    // This could be used for advanced filtering/search
    // For now, return a simple response
    return NextResponse.json({
      success: true,
      message: 'POST endpoint for exoplanets - advanced search/filtering coming soon',
      receivedData: { query, filters },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Exoplanets POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}
