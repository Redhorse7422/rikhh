import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { logger } from '@/libs/logger.client'

const ALLOWED_NO_SESSION_ROUTES = ['/login', '/forgot-password', '/invite-callback'] as const
const BUYER_PROTECTED_ROUTES = ['/profile', '/order'] as const

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  try {
    const url = request.nextUrl.clone()
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // Allow login and public pages without session
    if (ALLOWED_NO_SESSION_ROUTES.includes(pathname as any)) {
      if (token) {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Require auth for protected routes
    if (BUYER_PROTECTED_ROUTES.includes(pathname as any)) {
      if (!token) {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  } catch (error) {
    logger.error('Error occurred in middleware:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|image).*)'],
}
