import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    const source = searchParams.get('source') || 'nasa'

    let data: Record<string, unknown>[] = []
    
    if (source === 'mongodb') {
      // Fetch from MongoDB backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/exoplanets/all`)
      
      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`)
      }
      
      data = await response.json()
    } else {
      // Fetch from NASA API (fallback)
      const nasaResponse = await fetch(
        'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars+where+default_flag=1&format=json'
      )
      
      if (!nasaResponse.ok) {
        throw new Error(`NASA API request failed: ${nasaResponse.status}`)
      }
      
      data = await nasaResponse.json()
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return new NextResponse('No data available', { status: 404 })
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            if (value === null || value === undefined) return ''
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          }).join(',')
        )
      ].join('\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="exoplanets-${source}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        source,
        count: data.length,
        data,
        exportedAt: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        exportedAt: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, format = 'json', filename } = body

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    if (format === 'csv') {
      if (data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No data to export' },
          { status: 400 }
        )
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            if (value === null || value === undefined) return ''
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          }).join(',')
        )
      ].join('\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename || 'exoplanets'}.csv"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
      exportedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Export POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}
