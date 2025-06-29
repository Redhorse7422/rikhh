import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeftIcon } from '@/assets/icons'

interface CategoryHeaderProps {
  categoryName: string
  categoryImage: string
  productCount: string
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryName, categoryImage, productCount }) => {
  return (
    <div className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex items-center space-x-4'>
          <Link href='/' className='flex items-center text-gray-600 transition-colors hover:text-primary'>
            <ArrowLeftIcon className='mr-2 h-5 w-5' />
            Back to Home
          </Link>
          <div className='flex-1'>
            <div className='flex items-center space-x-4'>
              <div className='relative h-16 w-16 overflow-hidden rounded-full'>
                <Image src={categoryImage} alt={categoryName} fill className='object-cover' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>{categoryName}</h1>
                <p className='text-gray-600'>{productCount} products available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
