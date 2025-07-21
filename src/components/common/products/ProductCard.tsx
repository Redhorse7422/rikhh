'use client'

import type { Product } from '@/types/common'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { StarIcon } from '@/assets/icons'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const rating = product.rating ?? 0
  const reviews = product.reviews ?? 0
  const thumbnail = product.thumbnailImg?.url ?? '/placeholder.png' // fallback image

  return (
    <div className='group overflow-hidden rounded-lg border border-gray-200 bg-white py-4 shadow-sm transition-shadow hover:shadow-md'>
      <Link href={`/product/${product.slug}`} className='block'>
        <div className='relative'>
          <Image
            src={thumbnail}
            alt={product.name}
            width={300}
            height={300}
            className='h-48 w-full bg-white object-contain transition-transform duration-300 group-hover:scale-105'
          />
          {product.badge && (
            <span className='absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs text-white'>
              {product.badge}
            </span>
          )}
        </div>

        <div className='p-4 pb-0'>
          <h3 className='mb-2 line-clamp-2 font-medium text-gray-900'>{product.name}</h3>

          {/* <div className='mb-2 flex items-center'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className='ml-1 text-sm text-gray-500'>({reviews})</span>
          </div> */}

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              {product.salePrice > 0 && <span className='text-lg font-bold text-gray-900'>${product.salePrice}</span>}
              <span
                className={`${
                  product.salePrice > 0 ? 'text-sm text-gray-500 line-through' : 'text-lg font-bold text-gray-900'
                }`}
              >
                ${product.regularPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* <div className='flex items-center justify-between px-4 pt-3'>
        <button className='w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90'>
          Add to Cart
        </button>
      </div> */}
    </div>
  )
}
