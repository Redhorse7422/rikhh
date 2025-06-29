'use client'

import type { Category } from '@/types/common'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  category: Category
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => (
  <Link href={category.href} className='group'>
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'>
      <div className='relative'>
        <Image
          src={category.image}
          alt={category.name}
          width={300}
          height={200}
          className='h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30' />
      </div>
      <div className='p-4'>
        <h3 className='mb-1 font-semibold text-gray-900'>{category.name}</h3>
        <p className='text-sm text-gray-500'>{category.count}</p>
      </div>
    </div>
  </Link>
)
