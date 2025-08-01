import type { Metadata } from 'next'

import { TermsAndConditionsPage } from '@/components/Pages/TermsAndConditions'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Rikhh',
  description: 'Read the terms and conditions for using Rikhh platform. Learn about user responsibilities, fees, liability, and more.',
  openGraph: {
    title: 'Terms and Conditions | Rikhh',
    description: 'Read the terms and conditions for using Rikhh platform. Learn about user responsibilities, fees, liability, and more.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/terms-conditions`,
  },
}

export default function TermsAndConditions() {
  return <TermsAndConditionsPage />
} 
