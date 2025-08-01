'use client'

import type { Product } from '@/types/common'

import React from 'react'

import { StarIcon, HeartIcon } from '@/assets/icons'
import { ShareButton } from '@/components/common/ShareButton'
import { Icon } from '@/components/common/icon'

// Extended Product interface to match Firebase response
interface FirebaseProduct extends Product {
  sellerId: string
  images: string[]
  sizes: string[] // Add sizes array
  lat: number
  lng: number
  description: string
}

interface ProductInfoProps {
  product: FirebaseProduct
  selectedQuantity: number
  selectedSize: string
  onQuantityChange: (quantity: number) => void
  onSizeChange: (size: string) => void
  onAddToCart: () => void
  isLoading?: boolean
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedQuantity,
  selectedSize,
  onQuantityChange,
  onSizeChange,
  onAddToCart,
  isLoading = false,
}) => {
  const handleQuantityIncrement = () => {
    onQuantityChange(selectedQuantity + 1)
  }

  const handleQuantityDecrement = () => {
    onQuantityChange(selectedQuantity - 1)
  }

  const handleSizeSelect = (size: string) => {
    onSizeChange(size)
  }

  const getCurrentPrice = () => {
    return product.salePrice || product.regularPrice
  }

  const getSalePrice = () => {
    if (product.salePrice && product.salePrice !== product.regularPrice) {
      return product.salePrice
    }
    return null
  }

  const getAvailabilityText = () => {
    if (product.inStock) {
      return { text: 'In Stock', color: 'text-green-600' }
    }
    return { text: 'Out of Stock', color: 'text-red-600' }
  }

  const isOutOfStock = () => {
    return !product.inStock
  }

  const hasSizes = product.sizes && product.sizes.length > 0
  const isSizeRequired = hasSizes && !selectedSize

  const availability = getAvailabilityText()
  const currentPrice = getCurrentPrice()
  const salePrice = getSalePrice()
  const isOnSale = salePrice !== null && salePrice < currentPrice

  return (
    <div className='space-y-6'>
      {/* Product Title and Badge */}
      <div>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>{product.name}</h1>
        <p className='text-lg text-gray-600'>{product.description}</p>
      </div>

      {/* Rating and Reviews */}
      <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className='ml-2 text-sm text-gray-600'>{product.rating || 0}</span>
        </div>
        <span className='text-sm text-gray-500'>({product.reviews || 0} reviews)</span>
        <span className={`text-sm font-medium ${availability.color}`}>{availability.text}</span>
      </div>

      {/* Price */}
      <div className='space-y-2'>
        <div className='flex items-center space-x-3'>
          <span className='text-3xl font-bold text-gray-900'>
            ₹{isOnSale ? salePrice.toFixed(2) : currentPrice.toFixed(2)}
          </span>
          {isOnSale && (
            <>
              <span className='text-xl text-gray-500 line-through'>₹{currentPrice.toFixed(2)}</span>
              <span className='rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600'>
                -{Math.round(((currentPrice - salePrice) / currentPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Category */}
      {product.category && (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-gray-900'>Category</h3>
          <div className='flex flex-wrap gap-2'>
            <span className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'>{product.category}</span>
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-900'>Select Size</h3>
          <div className='flex flex-wrap gap-2'>
            {product.sizes.map((size, index) => (
              <button
                key={index}
                type='button'
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
          {isSizeRequired && <p className='text-sm text-red-600'>Please select a size</p>}
        </div>
      )}

      {/* Quantity Selector */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-gray-900'>Quantity</h3>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleQuantityDecrement}
            disabled={selectedQuantity <= 1}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Icon name='AiOutlineMinus' className='h-4 w-4' />
          </button>
          <span className='w-16 text-center text-lg font-medium'>{selectedQuantity}</span>
          <button
            onClick={handleQuantityIncrement}
            disabled={selectedQuantity >= 99}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Icon name='AiOutlinePlus' className='h-4 w-4' />
          </button>
          {/* <span className='text-sm text-gray-500'>Max 99</span> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button
          onClick={onAddToCart}
          disabled={isOutOfStock() || isLoading || isSizeRequired}
          className='w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
              Adding...
            </div>
          ) : isOutOfStock() ? (
            'Out of Stock'
          ) : isSizeRequired ? (
            'Select Size'
          ) : (
            'Book Now'
          )}
        </button>

        <div className='flex space-x-3'>
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/product/${product.id}`}
            title={product.name}
            description={product.description}
            image={product.thumbnailImg || product.images?.[0]}
            className='flex-1'
          />
        </div>
      </div>

      {/* Product Details */}
      <div className='space-y-4 border-t pt-6'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium text-gray-900'>Product ID:</span>
            <span className='ml-2 text-gray-600'>{product.id}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Stock:</span>
            <span className='ml-2 text-gray-600'>{product.inStock ? 'Available' : 'Out of Stock'}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Shipping:</span>
            <span className='ml-2 text-gray-600'>Calculated at checkout</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Images:</span>
            <span className='ml-2 text-gray-600'>{product.images?.length || 0} photos</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h3 className='mb-2 font-medium text-gray-900'>Shipping Information</h3>
        <p className='text-sm text-gray-600'>
          Shipping cost calculated at checkout based on your location and selected method
        </p>
      </div>
    </div>
  )
}
