import type { Category } from '@/types/common'

import React, { useState } from 'react'

import Link from 'next/link'

import { ChevronUpIcon } from '@/assets/icons'
import { useApi } from '@/hooks/useApi'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact-us' },
  // { name: 'Best Sellers', href: '/best-sellers' },
  // { name: 'Clearance', href: '/clearance' },
]

export const BuyerNavigation: React.FC = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { getDataSource } = useApi()
  // Fetch categories from /v1/home (same as BuyerHomePage)
  const { data: homeConfig, isLoading } = getDataSource<{ categories: Category[] }>({
    path: '/v1/home',
  })
  const categories = homeConfig?.categories || []

  return (
    <nav className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-12 items-center justify-between'>
          {/* Categories Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className='flex items-center space-x-1 text-gray-700 transition-colors hover:text-primary'
            >
              <span className='font-medium'>Categories</span>
              <ChevronUpIcon className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoriesOpen && (
              <div className='absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg'>
                <div className='py-2'>
                  {isLoading ? (
                    <div className='flex justify-center py-4'>
                      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className='px-4 py-2 text-sm text-gray-500'>No categories found.</div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className='block bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:text-primary'
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Menu Items */}
          <div className='hidden items-center space-x-8 md:flex'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-primary'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Promotional */}
          <div className='flex items-center space-x-4'>
            <span className='text-sm font-medium text-secondary'>Fast & Reliable Shipping</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
