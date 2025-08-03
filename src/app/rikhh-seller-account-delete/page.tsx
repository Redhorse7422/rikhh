import type { Metadata } from 'next'

import { RikhhSellerAccountDelete } from '@/components/Pages/RikhhSellerAccountDelete'

export const metadata: Metadata = {
  title: 'Rikhh Seller Account Delete | Rikhh',
  description: 'Learn about Rikhh\'s Rikhh Seller Account Delete.',
  openGraph: {
    title: 'Rikhh Seller Account Delete | Rikhh',
    description: 'Learn about Rikhh\'s Rikhh Seller Account Delete. ',
    type: 'website',
    url: '/privacy-policy',
  },
}

export default function RikhhAccountDeletePage() {
  return <RikhhSellerAccountDelete />
} 
