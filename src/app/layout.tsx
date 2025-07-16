/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import 'flatpickr/dist/flatpickr.min.css'
import 'jsvectormap/dist/jsvectormap.css'
import NextTopLoader from 'nextjs-toploader'

import '@/css/satoshi.css'
import '@/css/style.css'
import { MainProviders } from '@/providers/MainProvider'
import { AgeConfirmationGate } from '@/components/AgeConfirmationGate'

export const metadata: Metadata = {
  title: {
    template: '%s | Aura Well USA',
    default: 'Aura Well USA',
  },
  description: 'Aura Well USA',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <MainProviders>
          <NextTopLoader color='#5750F1' showSpinner={false} />
          {children}
        </MainProviders>
      </body>
    </html>
  )
}
