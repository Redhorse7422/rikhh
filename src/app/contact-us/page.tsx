import type { Metadata } from 'next'

import { ContactUsPage } from '@/components/Pages/ContactUs'

export const metadata: Metadata = {
  title: 'Contact Us | Rikhh',
  description:
    'Get in touch with Rikhh. Contact us for inquiries, support, or any assistance you need. We\'re here to help 24/7.',
  openGraph: {
    title: 'Contact Us | Rikhh',
    description: 'Get in touch with Rikhh. Contact us for inquiries, support, or any assistance you need.',
    type: 'website',
    url: '/contact-us',
  },
}

export default function ContactUs() {
  return <ContactUsPage />
}
