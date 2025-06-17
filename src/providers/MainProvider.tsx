'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import ToastProvider from './ToastProvider'
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function MainProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme='light' attribute='class'>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
        </QueryClientProvider>
        <ToastProvider />
      </ThemeProvider>
    </SessionProvider>
  )
}
