'use client'

import type { ProductGalleryProps } from '@/types/product'

import React from 'react'

import Image from 'next/image'

import { SearchIcon } from '@/assets/icons'

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, mainImage, onImageChange }) => {
  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative aspect-square overflow-hidden rounded-lg bg-white'>
        <Image
          src={mainImage.url}
          alt={mainImage.alt}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />

        {/* Zoom indicator */}
        <div className='absolute bottom-4 right-4 rounded-full bg-white/80 p-2 backdrop-blur-sm'>
          <SearchIcon className='h-5 w-5 text-gray-600' />
        </div>

        {/* Sale badge */}
        <div className='absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white'>
          -31%
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className='grid grid-cols-4 gap-2'>
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => onImageChange(image)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary ${
              mainImage.id === image.id ? 'border-primary' : 'border-gray-200'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 8.33vw'
            />
          </button>
        ))}
      </div>

      {/* Image counter */}
      <div className='text-center text-sm text-gray-500'>
        {images.findIndex((img) => img.id === mainImage.id) + 1} of {images.length} images
      </div>
    </div>
  )
}
