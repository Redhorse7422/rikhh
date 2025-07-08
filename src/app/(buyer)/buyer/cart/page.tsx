import type { Metadata } from 'next'

import { CartPage } from '@/components/Pages/Buyer/CartPage'

export const metadata: Metadata = {
  title: 'Cart  | Your Store',
  description: ' shopping cart functionality',
}

export default function Page() {
  return <CartPage />
}
