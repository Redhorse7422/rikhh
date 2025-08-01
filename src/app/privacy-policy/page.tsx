import type { Metadata } from 'next'

import { PrivacyPolicyPage } from '@/components/Pages/PrivacyPolicy'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rikhh',
  description: 'Learn about Rikhh\'s privacy policy. Understand how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Rikhh',
    description: 'Learn about Rikhh\'s privacy policy. Understand how we collect, use, and protect your personal information.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/privacy-policy`,
  },
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />
} 
