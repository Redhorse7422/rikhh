import type { Metadata } from 'next'

import { CartPage } from '@/components/Pages/Buyer/CartPage'

export const metadata: Metadata = {
  title: 'Shopping Cart | Rikhh',
  description: 'Review and manage your shopping cart items. Add, remove, or update quantities before checkout.',
  openGraph: {
    title: 'Shopping Cart | Rikhh',
    description: 'Review and manage your shopping cart items. Add, remove, or update quantities before checkout.',
    type: 'website',
    siteName: 'Rikhh',
  },
  twitter: {
    card: 'summary',
    title: 'Shopping Cart | Rikhh',
    description: 'Review and manage your shopping cart items.',
  },
}

export default function Page() {
  return <CartPage />
}
