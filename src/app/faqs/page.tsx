import type { Metadata } from 'next'

import { FAQPage } from '@/components/Pages/FAQ'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Rikhh',
  description:
    'Find answers to common questions about Rikhh. Learn about orders, shipping, returns, vendor registration, and more.',
  openGraph: {
    title: 'Frequently Asked Questions | Rikhh',
    description:
      'Find answers to common questions about Rikhh. Learn about orders, shipping, returns, vendor registration, and more.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/faq`,
  },
}

export default function FAQ() {
  return <FAQPage />
}
