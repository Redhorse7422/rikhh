import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { logger } from '@/libs/logger.client'

// Constants for better maintainability
const ALLOWED_NO_SESSION_ROUTES = ['/login', '/forgot-password', '/invite-callback'] as const
const BUYER_PROTECTED_ROUTES = ['/profile', '/cart', '/checkout', '/order'] as const

export const middleware = async (request: NextRequest) => {
  const template = process.env.TEMPLATE
  const isBuyer = template === 'buyer'
  const isSeller = template === 'seller'
  const isAdmin = template === 'admin'

  const { pathname } = request.nextUrl

  try {
    const url = request.nextUrl.clone()
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // NOTE: For admin and seller, check if user is authenticated
    if (isAdmin || isSeller) {
      // NOTE: Redirect to login page if not authenticated
      if (!token) {
        if (ALLOWED_NO_SESSION_ROUTES.includes(pathname as any)) return NextResponse.next()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      // NOTE: Redirect to home page if authenticated and trying to access login page
      if (ALLOWED_NO_SESSION_ROUTES.includes(pathname as any)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // NOTE: For buyer, check if user is authenticated
    if (isBuyer) {
      if (BUYER_PROTECTED_ROUTES.includes(pathname as any)) {
        // Note: redirect to homepage
        if (!token) {
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
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
