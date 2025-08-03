import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 })
  }

  try {
    // Fetch the image from Firebase Storage
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
}
