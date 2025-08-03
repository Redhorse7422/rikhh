'use client'
import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SearchIcon, XIcon } from '@/assets/icons'
import { useFirebaseSearchProducts, useFirebaseSearchCount } from '@/hooks/useFirebase'

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose, searchQuery, onSearchChange }) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    data: searchResults,
    isLoading,
    error,
  } = useFirebaseSearchProducts(searchQuery, {
    limit: 6, // Show only 6 results in dropdown
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  // Get total count for display
  const { data: totalCount = 0 } = useFirebaseSearchCount(searchQuery)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className='absolute left-0 right-0 top-full z-50 mt-1 sm:mt-2'>
      <div
        ref={dropdownRef}
        className='max-h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:max-h-96'
      >
        {/* Search Input */}
        <div className='border-b border-gray-100 p-3 sm:p-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-transparent focus:ring-2 focus:ring-primary sm:pl-10 sm:pr-10 sm:text-base'
              autoFocus
            />
            <SearchIcon className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:left-3 sm:h-5 sm:w-5' />
            <button
              onClick={onClose}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 transform p-1 text-gray-400 hover:text-gray-600 sm:right-3'
            >
              <XIcon className='h-4 w-4 sm:h-5 sm:w-5' />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className='max-h-[calc(80vh-120px)] overflow-y-auto sm:max-h-80'>
          {isLoading && (
            <div className='flex items-center justify-center p-6 sm:p-8'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary sm:h-8 sm:w-8'></div>
              <span className='ml-2 text-sm text-gray-600 sm:ml-3 sm:text-base'>Searching...</span>
            </div>
          )}

          {error && (
            <div className='p-6 text-center text-gray-500 sm:p-8'>
              <div className='mb-2 text-3xl sm:text-4xl'>⚠️</div>
              <div className='text-sm sm:text-base'>Something went wrong. Please try again.</div>
            </div>
          )}

          {!isLoading && !error && searchQuery.length > 0 && (
            <>
              {searchResults &&
              searchResults.pages &&
              searchResults.pages[0]?.data &&
              searchResults.pages[0].data.length > 0 ? (
                <div className='p-3 sm:p-4'>
                  <div className='mb-3 flex items-center justify-between sm:mb-4'>
                    <h3 className='text-xs font-semibold text-gray-900 md:text-lg'>
                      Search Results ({totalCount})
                    </h3>
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      className='text-xs text-primary hover:underline sm:text-sm'
                      onClick={onClose}
                    >
                      View all results
                    </Link>
                  </div>

                  {/* Grid Layout for Search Results */}
                  <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3'>
                    {searchResults.pages[0]?.data?.map((product: FirebaseProduct) => (
                      <div key={product.id} className='group cursor-pointer'>
                        <Link href={`/product/${product.id}`} className='block' onClick={onClose}>
                          <div className='flex items-center space-x-2 rounded-lg border border-gray-200 p-2 transition-all hover:border-primary hover:shadow-md sm:space-x-3 sm:p-3'>
                            {/* Product Image */}
                            <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16'>
                              <Image
                                src={product.images.length > 0 ? product.images[0] : '/images/no-image.png'}
                                alt={product.name}
                                fill
                                className='object-cover'
                                sizes='(max-width: 640px) 48px, 64px'
                              />
                            </div>

                            {/* Product Info */}
                            <div className='min-w-0 flex-1'>
                              <h4 className='line-clamp-2 text-xs font-medium text-gray-900 group-hover:text-primary sm:text-sm'>
                                {product.name}
                              </h4>
                              <div className='mt-1 flex items-center space-x-1 sm:space-x-2'>
                                {product.salePrice && product.salePrice !== product.regularPrice ? (
                                  <>
                                    <span className='text-xs font-bold text-gray-900 sm:text-sm'>
                                      ${product.salePrice}
                                    </span>
                                    <span className='text-xs text-gray-500 line-through'>${product.regularPrice}</span>
                                  </>
                                ) : (
                                  <span className='text-xs font-bold text-gray-900 sm:text-sm'>
                                    ${product.regularPrice}
                                  </span>
                                )}
                              </div>
                              {product.category && (
                                <p className='mt-1 truncate text-xs text-gray-500'>{product.category}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {totalCount > 6 && (
                    <div className='mt-3 text-center sm:mt-4'>
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        className='inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 sm:px-4 sm:text-sm'
                        onClick={onClose}
                      >
                        View all {totalCount} results
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className='p-6 text-center text-gray-500 sm:p-8'>
                  <div className='mb-2 text-3xl sm:text-4xl'>🔍</div>
                  <div className='mb-2 text-base font-medium sm:text-lg'>No products found</div>
                  <div className='text-xs sm:text-sm'>
                    Try searching with different keywords or browse our categories
                  </div>
                  <div className='mt-3 sm:mt-4'>
                    <Link
                      href='/shop'
                      className='inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 sm:px-4 sm:text-sm'
                      onClick={onClose}
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading && !error && searchQuery.length === 0 && (
            <div className='p-6 text-center text-gray-500 sm:p-8'>
              <div className='mb-2 text-3xl sm:text-4xl'>🔍</div>
              <div className='mb-2 text-base font-medium sm:text-lg'>Start searching</div>
              <div className='text-xs sm:text-sm'>Type to search for products, categories, or brands</div>
            </div>
          )}
        </div>

        {/* Quick Categories */}
        {!isLoading && !error && searchQuery.length === 0 && (
          <div className='border-t border-gray-100 p-3 sm:p-4'>
            <h4 className='mb-2 text-xs font-medium text-gray-900 sm:mb-3 sm:text-sm'>Popular Categories</h4>
            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
              {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'].map((category) => (
                <button
                  key={category}
                  onClick={() => onSearchChange(category)}
                  className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-primary hover:text-white sm:px-3'
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
