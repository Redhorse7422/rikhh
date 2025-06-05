import type { NextURL } from 'next/dist/server/web/next-url'

import { NEXT_AUTH_SESSION_COOKIE_NAME } from '@/constants/next-auth'

export const convertPathClient = (nextUrl: NextURL) => {
  const pathname = nextUrl.pathname.replace('/api', '')
  return pathname + (nextUrl?.search || '')
}

export const getSessionCookieName = () =>
  process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-next-auth.session-token' : NEXT_AUTH_SESSION_COOKIE_NAME
