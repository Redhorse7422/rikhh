'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { getSafeImageUrl, isFirebaseStorageUrl, debugFirebaseStorageUrl } from '@/utils/image'

interface ProductCardProps {
  product: {
    id: string
    name: string
    thumbnailImg: string
    regularPrice: number
    salePrice: number
    badge?: string
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Use the utility function to get a safe image URL
  const thumbnail = imageError ? '/images/no-image.png' : getSafeImageUrl(product.thumbnailImg)

  // Debug Firebase Storage URLs in development
  // if (process.env.NODE_ENV === 'development' && isFirebaseStorageUrl(product.thumbnailImg)) {
  //   debugFirebaseStorageUrl(product.thumbnailImg)
  // }

  const handleImageError = () => {
    console.error(`❌ Image failed to load: ${product.thumbnailImg}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div className='group overflow-hidden rounded-lg border border-gray-200 bg-white pb-4 shadow-sm transition-shadow hover:shadow-md'>
      <Link href={`/product/${product.id}`} className='block'>
        <div className='relative'>
          {imageLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
            </div>
          )}

          <Image
            src={product.thumbnailImg}
            alt={product.name}
            width={0}
            height={0}
            sizes='100vw'
            className='h-56 w-full bg-white object-cover transition-transform duration-300 group-hover:scale-105'
            onError={handleImageError}
            onLoad={handleImageLoad}
            unoptimized={isFirebaseStorageUrl(thumbnail)}
            priority={false}
          />

          {product.badge && (
            <span className='absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs text-white'>
              {product.badge}
            </span>
          )}
        </div>

        <div className='p-4 pb-0'>
          <h3 className='mb-2 line-clamp-2 font-medium text-gray-900'>{product.name}</h3>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              {product.salePrice > 0 && product.salePrice !== product.regularPrice && (
                <span className='text-lg font-bold text-gray-900'>${product.salePrice}</span>
              )}
              <span
                className={`text-sm ${
                  product.salePrice > 0 && product.salePrice !== product.regularPrice
                    ? 'text-gray-500 line-through'
                    : 'text-lg font-bold text-gray-900'
                }`}
              >
                ₹{product.regularPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
