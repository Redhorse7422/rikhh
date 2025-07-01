import type { Metadata } from 'next'

import { ProductDetailPage } from '@/components/Pages/Buyer/ProductDetailPage'

export const metadata: Metadata = {
  title: 'Product Demo | Your Store',
  description: 'Demo of our product detail page',
}

export default function ProductDemoPage() {
  return <ProductDetailPage />
}
