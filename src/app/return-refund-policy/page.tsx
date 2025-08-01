import type { Metadata } from 'next'

import { ReturnRefundPage } from '@/components/Pages/ReturnRefund'

export const metadata: Metadata = {
  title: 'Return and Refund Policy | Rikhh',
  description: 'Learn about Rikhh\'s return and refund policy. Understand our in-store shopping approach and seller discretion policies.',
  openGraph: {
    title: 'Return and Refund Policy | Rikhh',
    description: 'Learn about Rikhh\'s return and refund policy. Understand our in-store shopping approach and seller discretion policies.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/return-refund`,
  },
}

export default function ReturnRefund() {
  return <ReturnRefundPage />
} 
