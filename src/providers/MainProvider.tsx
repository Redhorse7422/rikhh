'use client'

import { useState } from 'react'

import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import { CartProvider } from '@/contexts/CartContext'

import { FullScreenLoadingProvider } from './FullScreenLoadingProvider'
import ToastProvider from './ToastProvider'

export function MainProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme='light' attribute='class'>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <CartProvider>
              <FullScreenLoadingProvider>{children}</FullScreenLoadingProvider>
            </CartProvider>
          </HydrationBoundary>
        </QueryClientProvider>
        <ToastProvider />
      </ThemeProvider>
    </SessionProvider>
  )
}
