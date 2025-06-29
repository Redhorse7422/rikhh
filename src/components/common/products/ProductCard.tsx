'use client'

import type { Product } from '@/types/common'

import React from 'react'

import Image from 'next/image'

import { StarIcon, HeartIcon } from '@/assets/icons'
interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className='group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'>
    <div className='relative'>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
      />
      {product.badge && (
        <span className='absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs text-white'>
          {product.badge}
        </span>
      )}
      <button className='absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-gray-50'>
        <HeartIcon className='h-4 w-4 text-gray-400 transition-colors hover:text-red-500' />
      </button>
    </div>
    <div className='p-4'>
      <h3 className='mb-2 line-clamp-2 font-medium text-gray-900'>{product.name}</h3>
      <div className='mb-2 flex items-center'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className='ml-1 text-sm text-gray-500'>({product.reviews})</span>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <span className='text-lg font-bold text-gray-900'>${product.price}</span>
          <span className='text-sm text-gray-500 line-through'>${product.originalPrice}</span>
        </div>
      </div>
      <div className='flex items-center justify-between py-3'>
        <button className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90'>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
)
