'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import { ChevronUpIcon } from '@/assets/icons'

const categories = [
  { name: 'Electronics', href: '/category/electronics' },
  { name: 'Fashion', href: '/category/fashion' },
  { name: 'Home & Garden', href: '/category/home-garden' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Books', href: '/category/books' },
  { name: 'Health', href: '/category/health' },
  { name: 'Toys', href: '/category/toys' },
  { name: 'Automotive', href: '/category/automotive' },
]

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Deals', href: '/deals' },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Best Sellers', href: '/best-sellers' },
  { name: 'Clearance', href: '/clearance' },
]

export const BuyerNavigation: React.FC = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  return (
    <nav className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-12 items-center justify-between'>
          {/* Categories Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className='flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors'
            >
              <span className='font-medium'>Categories</span>
              <ChevronUpIcon className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoriesOpen && (
              <div className='absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg'>
                <div className='py-2'>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className='block bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:text-primary'
                    >
                      {category.name}
                    </Link>
                  ))}
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
                className='text-sm font-medium text-gray-700 hover:text-primary transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Promotional */}
          <div className='flex items-center space-x-4'>
            <span className='text-sm font-medium text-secondary'>Free Shipping on Orders $50+</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
