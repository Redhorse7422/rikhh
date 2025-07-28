import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/Pages/Buyer/CheckoutPage'

export const metadata: Metadata = {
  title: 'Checkout | Your Store',
  description: 'Complete your purchase with our secure checkout process',
}

export default function Page() {
  return <CheckoutPage />
}
