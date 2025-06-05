import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const middleware = async (request: NextRequest) => {
  const template = process.env.TEMPLATE
  const isBuyer = template === 'buyer'
  const isSeller = template === 'seller'
  const isAdmin = template === 'admin'

  const { pathname } = request.nextUrl
  const isPathBuyer = pathname.startsWith('/buyer')
  const isPathSeller = pathname.startsWith('/seller')
  const isPathAdmin = pathname.startsWith('/admin')
  console.log('Template ==>', pathname)
  console.log('PathName ==>', pathname)
  console.log('isBuyer', isBuyer)
  console.log('isAdmin', isAdmin)

  try {
    if (isBuyer && (isPathSeller || isPathAdmin)) return new Response('Not Found', { status: 404 })
    if (isSeller && (isPathBuyer || isPathAdmin)) return new Response('Not Found', { status: 404 })
    if (isAdmin && (isPathBuyer || isPathSeller)) return new Response('Not Found', { status: 404 })

    const url = request.nextUrl.clone()
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // NOTE: For admin and seller, check if user is authenticated
    if (isAdmin || isSeller) {
      const allowNoSession = ['/login', '/forgot-password', '/invite-callback']

      // NOTE: Redirect to login page if not authenticated
      if (!token) {
        if (allowNoSession.includes(pathname)) return NextResponse.next()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      // NOTE: Redirect to home page if authenticated and trying to access login page
      if (allowNoSession.includes(pathname)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // NOTE: For buyer, check if user is authenticated
    if (isBuyer) {
      const checkSession = ['/profile', '/cart', '/checkout', '/order']

      if (checkSession.includes(pathname)) {
        // Note: redirect to homepage
        if (!token) {
          url.pathname = '/'

          return NextResponse.redirect(url)
        }
        // if (!token) return new Response('Unauthorized', { status: 401 })
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error occurred in middleware:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|image).*)'],
  // matcher: [`/login`, '/', '/seller/:path*'],
}
