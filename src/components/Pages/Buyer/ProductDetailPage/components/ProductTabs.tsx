'use client'

import type { ProductTabsProps } from '@/types/product'

import React from 'react'

import { StarIcon, CheckIcon } from '@/assets/icons'

export const ProductTabs: React.FC<ProductTabsProps> = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviews})` },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Description</h3>
              <div className='prose max-w-none text-gray-600'>
                <p className='whitespace-pre-line'>{product.longDescription}</p>
              </div>
            </div>

            {product.features.length > 0 && (
              <div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Key Features</h3>
                <ul className='space-y-2'>
                  {product.features.map((feature, index) => (
                    <li key={index} className='flex items-start'>
                      <CheckIcon className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span className='text-gray-600'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case 'specifications':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Technical Specifications</h3>
              <div className='overflow-hidden rounded-lg bg-gray-50'>
                <table className='w-full'>
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                          {spec.name}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {product.materials.length > 0 && (
                <div>
                  <h3 className='mb-4 text-lg font-semibold text-gray-900'>Materials</h3>
                  <ul className='space-y-2'>
                    {product.materials.map((material, index) => (
                      <li key={index} className='text-gray-600'>
                        • {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.dimensions && (
                <div>
                  <h3 className='mb-4 text-lg font-semibold text-gray-900'>Dimensions</h3>
                  <div className='space-y-2 text-gray-600'>
                    <p>Length: {product.dimensions.length}cm</p>
                    <p>Width: {product.dimensions.width}cm</p>
                    <p>Height: {product.dimensions.height}cm</p>
                    <p>Weight: {product.weight}kg</p>
                  </div>
                </div>
              )}
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
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className='ml-2 text-sm text-gray-600'>{product.rating} out of 5</span>
                </div>
              </div>
              <button className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'>
                Write a Review
              </button>
            </div>

            <div className='space-y-6'>
              {product.productReviews.map((review) => (
                <div key={review.id} className='border-b border-gray-200 pb-6 last:border-b-0'>
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <span className='text-sm font-medium text-gray-600'>{review.userName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className='flex items-center space-x-2'>
                          <span className='font-medium text-gray-900'>{review.userName}</span>
                          {review.verified && (
                            <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                              Verified
                            </span>
                          )}
                        </div>
                        <div className='mt-1 flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className='ml-2 text-sm text-gray-500'>{review.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-2 font-medium text-gray-900'>{review.title}</h4>
                    <p className='mb-3 text-gray-600'>{review.comment}</p>
                    <div className='flex items-center space-x-4 text-sm text-gray-500'>
                      <button className='flex items-center space-x-1 hover:text-gray-700'>
                        <span>Helpful</span>
                        <span>({review.helpful})</span>
                      </button>
                      <button className='hover:text-gray-700'>Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {product.productReviews.length === 0 && (
              <div className='py-8 text-center'>
                <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
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
