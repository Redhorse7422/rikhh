import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test WhatsApp Preview | Rikhh',
  description: 'This is a test page to verify WhatsApp link previews are working correctly.',
  openGraph: {
    title: 'Test WhatsApp Preview | Rikhh',
    description: 'This is a test page to verify WhatsApp link previews are working correctly.',
    type: 'website',
    url: 'https://rikhh.com/test-whatsapp',
    siteName: 'Rikhh',
    images: [
      {
        url: 'https://rikhh.com/images/best-value-banner.png',
        width: 1200,
        height: 630,
        alt: 'Rikhh Test Page',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test WhatsApp Preview | Rikhh',
    description: 'This is a test page to verify WhatsApp link previews are working correctly.',
    images: ['https://rikhh.com/images/best-value-banner.png'],
  },
}

export default function TestWhatsAppPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-gray-900'>WhatsApp Test Page</h1>
        <p className='mb-6 text-gray-600'>
          This page is designed to test WhatsApp link previews. Share this URL in WhatsApp to see if the preview works.
        </p>
        <div className='rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700'>
          <strong>Test URL:</strong> https://rikhh.com/test-whatsapp
        </div>
        <div className='mt-6 text-sm text-gray-500'>
          <p>Expected WhatsApp Preview:</p>
          {/* <ul className='mt-2 text-left'>
            <li>• Title: "Test WhatsApp Preview | Rikhh"</li>
            <li>• Description: "This is a test page..."</li>
            <li>• Image: Rikhh banner image</li>
            <li>• Website: Rikhh</li>
          </ul> */}
        </div>
      </div>
    </div>
  )
}
