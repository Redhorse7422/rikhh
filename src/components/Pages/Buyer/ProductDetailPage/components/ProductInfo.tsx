'use client'

import type { ProductInfoProps } from '@/types/product'

import React, { useState } from 'react'

import { StarIcon, HeartIcon } from '@/assets/icons'
import { Icon } from '@/components/common/icon'

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedQuantity,
  onQuantityChange,
  onAddToCart,
  onAddToWishlist,
  onShare,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
  }

  const handleQuantityIncrement = () => {
    onQuantityChange(selectedQuantity + 1)
  }

  const handleQuantityDecrement = () => {
    onQuantityChange(selectedQuantity - 1)
  }

  const getAvailabilityText = () => {
    switch (product.availability) {
      case 'in-stock':
        return { text: 'In Stock', color: 'text-green-600' }
      case 'low-stock':
        return { text: 'Low Stock', color: 'text-orange-600' }
      case 'out-of-stock':
        return { text: 'Out of Stock', color: 'text-red-600' }
      case 'pre-order':
        return { text: 'Pre-order', color: 'text-blue-600' }
      default:
        return { text: 'In Stock', color: 'text-green-600' }
    }
  }

  const availability = getAvailabilityText()

  return (
    <div className='space-y-6'>
      {/* Product Title and Badge */}
      <div>
        {product.badge && (
          <span className='mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white'>
            {product.badge}
          </span>
        )}
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>{product.name}</h1>
        <p className='text-lg text-gray-600'>{product.shortDescription}</p>
      </div>

      {/* Rating and Reviews */}
      <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className='ml-2 text-sm text-gray-600'>{product.rating}</span>
        </div>
        <span className='text-sm text-gray-500'>({product.reviews} reviews)</span>
        <span className={`text-sm font-medium ${availability.color}`}>{availability.text}</span>
      </div>

      {/* Price */}
      <div className='space-y-2'>
        <div className='flex items-center space-x-3'>
          <span className='text-3xl font-bold text-gray-900'>${product.price}</span>
          {product.isOnSale && (
            <>
              <span className='text-xl text-gray-500 line-through'>${product.originalPrice}</span>
              <span className='rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600'>
                -{product.discountPercentage}%
              </span>
            </>
          )}
        </div>
        {product.isOnSale && product.saleEndDate && (
          <p className='text-sm text-gray-600'>Sale ends {product.saleEndDate.toLocaleDateString()}</p>
        )}
      </div>

      {/* Variants */}
      {product.variants.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-900'>Color</h3>
          <div className='flex space-x-3'>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant)}
                disabled={!variant.inStock}
                className={`relative rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  selectedVariant.id === variant.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                } ${!variant.inStock ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {variant.value}
                {!variant.inStock && <span className='absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500'></span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-gray-900'>Quantity</h3>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleQuantityDecrement}
            disabled={selectedQuantity <= product.minOrderQuantity}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {/* <MinusIcon className="h-4 w-4" /> */}
            <Icon name='AiOutlineMinus' className='h-4 w-4' />
          </button>
          <span className='w-16 text-center text-lg font-medium'>{selectedQuantity}</span>
          <button
            onClick={handleQuantityIncrement}
            disabled={selectedQuantity >= product.maxOrderQuantity}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {/* <PlusIcon className='h-4 w-4' /> */}
            <Icon name='AiOutlinePlus' className='h-4 w-4' />
          </button>
          <span className='text-sm text-gray-500'>{product.stockQuantity} available</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button
          onClick={onAddToCart}
          disabled={product.availability === 'out-of-stock'}
          className='w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {product.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>

        <div className='flex space-x-3'>
          <button
            onClick={onAddToWishlist}
            className={`flex-1 rounded-lg border px-4 py-3 font-medium transition-colors ${
              product.inWishlist
                ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HeartIcon className={`mr-2 inline h-5 w-5 ${product.inWishlist ? 'fill-current' : ''}`} />
            {product.inWishlist ? 'Wishlisted' : 'Wishlist'}
          </button>

          <button
            onClick={onShare}
            className='flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            {/* <ShareIcon className="mr-2 h-5 w-5 inline" /> */}
            Share
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className='space-y-4 border-t pt-6'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium text-gray-900'>Brand:</span>
            <span className='ml-2 text-gray-600'>{product.brand}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>SKU:</span>
            <span className='ml-2 text-gray-600'>{product.sku}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Warranty:</span>
            <span className='ml-2 text-gray-600'>{product.warranty}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Return Policy:</span>
            <span className='ml-2 text-gray-600'>{product.returnPolicy}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h3 className='mb-2 font-medium text-gray-900'>Shipping Information</h3>
        <p className='text-sm text-gray-600'>{product.shippingInfo}</p>
      </div>
    </div>
  )
}
