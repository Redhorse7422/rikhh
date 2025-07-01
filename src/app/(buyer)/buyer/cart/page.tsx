import type { Metadata } from 'next'

import { CartPage } from '@/components/Pages/Buyer/CartPage'

export const metadata: Metadata = {
  title: 'Shopping Cart | Your Store',
  description: 'View and manage your shopping cart',
}

export default function CartPageRoute() {
  return <CartPage />
}
