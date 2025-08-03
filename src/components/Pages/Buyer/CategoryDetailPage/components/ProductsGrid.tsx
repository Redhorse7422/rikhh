import type { FirebaseProduct } from '../../ProductDetailPage'

import React from 'react'

import { ProductCard } from '@/components/common/products/ProductCard'

interface ProductsGridProps {
  products: FirebaseProduct[]
  onLoadMore?: () => void
  hasMoreProducts?: boolean
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onLoadMore, hasMoreProducts = true }) => {
  return (
    <div className='flex-1'>
      {/* Products Grid */}
      <div className='grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className='mt-8 text-center'>
          <button
            onClick={onLoadMore}
            className='rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90'
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  )
}
