/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import 'jsvectormap/dist/jsvectormap.css'
import NextTopLoader from 'nextjs-toploader'

import '@/css/satoshi.css'
import '@/css/style.css'
import { MainProviders } from '@/providers/MainProvider'
import { BuyerLayout } from '@/components/Layouts/BuyerLayout/BuyerLayout'

export const metadata: Metadata = {
  title: {
    template: '%s | Rikhh',
    default: 'Rikhh',
  },
  description: 'Rikhh',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <MainProviders>
          <NextTopLoader color='#22AD5C' showSpinner={false} />
          <BuyerLayout>{children}</BuyerLayout>
        </MainProviders>
      </body>
    </html>
  )
}
