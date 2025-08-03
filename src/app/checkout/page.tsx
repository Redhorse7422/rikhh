import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/Pages/Buyer/CheckoutPage'

export const metadata: Metadata = {
  title: 'Checkout | Rikhh',
  description: 'Complete your purchase with our secure checkout process. Fast, safe, and convenient shopping experience.',
  openGraph: {
    title: 'Checkout | Rikhh',
    description: 'Complete your purchase with our secure checkout process. Fast, safe, and convenient shopping experience.',
    type: 'website',
    siteName: 'Rikhh',
  },
  twitter: {
    card: 'summary',
    title: 'Checkout | Rikhh',
    description: 'Complete your purchase with our secure checkout process.',
  },
}

export default function Page() {
  return <CheckoutPage />
}
