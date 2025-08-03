'use client'
import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SearchIcon, XIcon } from '@/assets/icons'
import { useFirebaseSearchProducts, useFirebaseSearchCount } from '@/hooks/useFirebase'
import { getSafeImageUrl } from '@/utils/image'

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
    <div className='absolute left-0 right-0 top-full z-50 mt-2'>
      <div ref={dropdownRef} className='rounded-lg border border-gray-200 bg-white shadow-lg'>
        {/* Search Input */}
        <div className='border-b border-gray-100 p-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search products, categories...'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 focus:border-transparent focus:ring-2 focus:ring-primary'
              autoFocus
            />
            <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
            <button
              onClick={onClose}
              className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
            >
              <XIcon className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className='max-h-96 overflow-y-auto'>
          {isLoading && (
            <div className='flex items-center justify-center p-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary'></div>
              <span className='ml-3 text-gray-600'>Searching...</span>
            </div>
          )}

          {error && (
            <div className='p-8 text-center text-gray-500'>
              <div className='mb-2 text-4xl'>⚠️</div>
              <div>Something went wrong. Please try again.</div>
            </div>
          )}

          {!isLoading && !error && searchQuery.length > 0 && (
            <>
              {searchResults &&
              searchResults.pages &&
              searchResults.pages[0]?.data &&
              searchResults.pages[0].data.length > 0 ? (
                <div className='p-4'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>Search Results ({totalCount})</h3>
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      className='text-sm text-primary hover:underline'
                      onClick={onClose}
                    >
                      View all results
                    </Link>
                  </div>

                  {/* Grid Layout for Search Results */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {searchResults.pages[0]?.data?.map((product: FirebaseProduct) => (
                      <div key={product.id} className='group cursor-pointer'>
                        <Link href={`/product/${product.id}`} className='block' onClick={onClose}>
                          <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-primary hover:shadow-md'>
                            {/* Product Image */}
                            <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
                              <Image
                                src={product.images.length > 0 ? product.images[0] : '/images/no-image.png'}
                                alt={product.name}
                                fill
                                className='object-cover'
                                sizes='64px'
                              />
                            </div>

                            {/* Product Info */}
                            <div className='min-w-0 flex-1'>
                              <h4 className='line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary'>
                                {product.name}
                              </h4>
                              <div className='mt-1 flex items-center space-x-2'>
                                {product.salePrice && product.salePrice !== product.regularPrice ? (
                                  <>
                                    <span className='text-sm font-bold text-gray-900'>${product.salePrice}</span>
                                    <span className='text-xs text-gray-500 line-through'>${product.regularPrice}</span>
                                  </>
                                ) : (
                                  <span className='text-sm font-bold text-gray-900'>${product.regularPrice}</span>
                                )}
                              </div>
                              {product.category && <p className='mt-1 text-xs text-gray-500'>{product.category}</p>}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {totalCount > 6 && (
                    <div className='mt-4 text-center'>
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        className='inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
                        onClick={onClose}
                      >
                        View all {totalCount} results
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className='p-8 text-center text-gray-500'>
                  <div className='mb-2 text-4xl'>🔍</div>
                  <div className='mb-2 text-lg font-medium'>No products found</div>
                  <div className='text-sm'>Try searching with different keywords or browse our categories</div>
                  <div className='mt-4'>
                    <Link
                      href='/shop'
                      className='inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
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
            <div className='p-8 text-center text-gray-500'>
              <div className='mb-2 text-4xl'>🔍</div>
              <div className='mb-2 text-lg font-medium'>Start searching</div>
              <div className='text-sm'>Type to search for products, categories, or brands</div>
            </div>
          )}
        </div>

        {/* Quick Categories */}
        {!isLoading && !error && searchQuery.length === 0 && (
          <div className='border-t border-gray-100 p-4'>
            <h4 className='mb-3 text-sm font-medium text-gray-900'>Popular Categories</h4>
            <div className='flex flex-wrap gap-2'>
              {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'].map((category) => (
                <button
                  key={category}
                  onClick={() => onSearchChange(category)}
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-primary hover:text-white'
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
