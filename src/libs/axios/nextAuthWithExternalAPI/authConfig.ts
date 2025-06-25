import type { AuthOptions } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { server } from '@/libs/axios'
import { logger } from '@/libs/logger.server'
import { textTimeToTimestamp } from '@/utils/textTimeToTimestamp'

export const authConfig: AuthOptions = {
  pages: {
    signIn: process.env.NEXT_PUBLIC_AUTH_LOGIN_URI,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) {
          logger.error('Credentials are null')
          return null
        }

        try {
          logger.info('Attempting login with credentials...')
          const result = await server.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
            ...(credentials?.userType && { userType: credentials.userType }),
          })

          if (result.status !== 200) {
            logger.error('Failed to login with credentials: Invalid status')
            return null
          }

          logger.info('Login successful')
          return { ...result.data.data }
        } catch (error) {
          logger.error('Failed to login with credentials:', error)
          return null
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: textTimeToTimestamp(process.env.NEXTAUTH_SESSION_MAX_AGE as string, true),
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token = { ...user }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token as never
      return {
        ...session,
        user: { ...session.user, expires: session.expires },
      }
    },
  },
}
