import type { Metadata } from 'next'

import { CartPage } from '@/components/Pages/Buyer/CartPage'

export const metadata: Metadata = {
  title: 'Cart Demo | Your Store',
  description: 'Demo of the shopping cart functionality',
}

export default function CartDemoPage() {
  return <CartPage />
}
