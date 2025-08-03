import type { Metadata } from 'next'

import { RikhhAccountDelete } from '@/components/Pages/RikhhAccountDelete'

export const metadata: Metadata = {
  title: 'Rikhh Account Delete | Rikhh',
  description: 'Learn about Rikhh\'s RikhhAccountDelete.',
  openGraph: {
    title: 'Rikhh Account Delete | Rikhh',
    description: 'Learn about Rikhh\'s Rikhh Account Delete. ',
    type: 'website',
    url: '/privacy-policy',
  },
}

export default function RikhhAccountDeletePage() {
  return <RikhhAccountDelete />
} 
