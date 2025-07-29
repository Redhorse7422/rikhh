import type { Metadata } from 'next'

import { ProductDetailPage } from '@/components/Pages/Buyer/ProductDetailPage'

import { fetchProductById } from './utils'

export const metadata: Metadata = {
  title: 'Product | Your Store',
  description: 'Product details',
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const product = await fetchProductById(resolvedParams.id)

  if (!product) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Product Not Found</h1>
          <p className='text-gray-600'>The product you&apos;re looking for doesn&apos;t exist.</p>
          <p className='mt-2 text-sm text-gray-500'>ID: {resolvedParams.id}</p>
        </div>
      </div>
    )
  }

  return <ProductDetailPage product={product} isLoading={false} />
}
