import type { Metadata } from 'next'

import { ProductDetailPage } from '@/components/Pages/Buyer/ProductDetailPage'

import { fetchProductBySlug } from './utils'

export const metadata: Metadata = {
  title: 'Product Demo | Your Store',
  description: 'Demo of our product detail page',
}
// export default async function Page({ params }: PageProps) {
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = await fetchProductBySlug((await params).slug)
  if (!product) {
    return <div>Product not found</div>
  }
  return <ProductDetailPage product={product} isLoading={false} />
}
