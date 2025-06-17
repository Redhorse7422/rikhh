'user client'

import { signOut } from 'next-auth/react'

export const signOutAndReLogin = async () => {
  const loginUrl = `/${process.env.NEXT_PUBLIC_AUTH_LOGIN_URI}`

  console.error('Token expired, sign out and re-login')
  await signOut({
    redirect: true,
    callbackUrl: `${loginUrl.replaceAll('//', '/')}?sessionExpired=true`,
  })
}
