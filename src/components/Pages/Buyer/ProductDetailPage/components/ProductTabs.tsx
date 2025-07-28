'use client'

import type { Product } from '@/types/common'

import React from 'react'

import { StarIcon } from '@/assets/icons'

// Extended Product interface to match Firebase response
interface FirebaseProduct extends Product {
  sellerId: string
  images: string[]
  lat: number
  lng: number
  description: string
}

interface ProductTabsProps {
  product: FirebaseProduct
  activeTab: string
  onTabChange: (tab: string) => void
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Product Details' },
    { id: 'reviews', label: 'Reviews' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Description</h3>
              <div className='prose max-w-none text-gray-600'>
                <p className='whitespace-pre-line'>{product.description}</p>
              </div>
            </div>

            {product.images && product.images.length > 0 && (
              <div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Images</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {product.images.map((imageUrl, index) => (
                    <div key={index} className='aspect-square overflow-hidden rounded-lg'>
                      <img
                        src={imageUrl}
                        alt={`${product.name} - Image ${index + 1}`}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          e.currentTarget.src = '/images/no-image.png'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'specifications':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Information</h3>
              <div className='overflow-hidden rounded-lg bg-gray-50'>
                <table className='w-full'>
                  <tbody>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                        Product Name
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.name}</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Product ID</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.id}</td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Category</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.category}</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Stock Status</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Regular Price</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>${product.regularPrice}</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Sale Price</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>${product.salePrice}</td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Rating</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.rating} / 5</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Reviews</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.reviews} reviews</td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Seller ID</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.sellerId}</td>
                    </tr>
                    {product.lat && product.lng && (
                      <tr className='bg-gray-50'>
                        <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Location</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>
                          {product.lat.toFixed(6)}, {product.lng.toFixed(6)}
                        </td>
                      </tr>
                    )}
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Images</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.images?.length || 0} photos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Customer Reviews</h3>
                <div className='mt-2 flex items-center'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className='ml-2 text-sm text-gray-600'>{product.rating || 0} out of 5</span>
                </div>
              </div>
              <button className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'>
                Write a Review
              </button>
            </div>

            <div className='py-8 text-center'>
              <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='rounded-lg bg-white shadow-sm'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8 px-6'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='p-6'>{renderTabContent()}</div>
    </div>
  )
}
