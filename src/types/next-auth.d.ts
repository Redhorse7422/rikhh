import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      firstName?: string
      lastName?: string
      id: string
      buyerId?: string
      accessToken?: string
      refreshToken?: string
      type: 'seller' | 'buyer' | 'admin'
      roles?: { id: string; name: string }[]
      sellers?: { id: string; name: string; slug: string }[]
    } & DefaultSession['user']
  }
}
