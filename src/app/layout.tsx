/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import 'jsvectormap/dist/jsvectormap.css'
import NextTopLoader from 'nextjs-toploader'

import '@/css/satoshi.css'
import '@/css/style.css'
import { MainProviders } from '@/providers/MainProvider'
import { BuyerLayout } from '@/components/Layouts/BuyerLayout/BuyerLayout'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'),
  title: {
    template: '%s | Rikhh',
    default: 'Rikhh - Your Online Shopping Destination',
  },
  description: 'Discover amazing products at great prices on Rikhh. Shop the latest trends in fashion, electronics, home & living, and more.',
  keywords: 'online shopping, ecommerce, fashion, electronics, home decor, India',
  authors: [{ name: 'Rikhh Team' }],
  creator: 'Rikhh',
  publisher: 'Rikhh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph defaults
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Rikhh',
    title: 'Rikhh - Your Online Shopping Destination',
    description: 'Discover amazing products at great prices on Rikhh. Shop the latest trends in fashion, electronics, home & living, and more.',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Rikhh - Online Shopping',
      },
    ],
  },
  
  // Twitter Card defaults
  twitter: {
    card: 'summary_large_image',
    title: 'Rikhh - Your Online Shopping Destination',
    description: 'Discover amazing products at great prices on Rikhh. Shop the latest trends in fashion, electronics, home & living, and more.',
    images: ['/images/logo.jpg'],
    creator: '@rikhh',
    site: '@rikhh',
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <MainProviders>
          <NextTopLoader color='#22AD5C' showSpinner={false} />
          <BuyerLayout>{children}</BuyerLayout>
        </MainProviders>
      </body>
    </html>
  )
}
