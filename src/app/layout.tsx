import '@/css/satoshi.css'
import '@/css/style.css'

import 'flatpickr/dist/flatpickr.min.css'
import 'jsvectormap/dist/jsvectormap.css'

import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import type { PropsWithChildren } from 'react'
import { MainProviders } from '@/providers/MainProvider'

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
