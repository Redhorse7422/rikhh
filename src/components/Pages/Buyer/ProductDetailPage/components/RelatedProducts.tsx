'use client'

import type { RelatedProductsProps } from '@/types/product'

import React from 'react'

import { ProductCard } from '@/components/common/products/ProductCard'

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return null
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Related Products</h2>
        <p className='text-gray-600'>You might also like these products</p>
      </div>

              <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
