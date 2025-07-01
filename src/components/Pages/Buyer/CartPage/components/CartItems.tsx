'use client'

import type { CartItem, CartItemProps } from '@/types/cart'

import React from 'react'

import Image from 'next/image'

import { Icon } from '@/components/common/icon'

interface CartItemsProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  isUpdating?: boolean
}

export const CartItems: React.FC<CartItemsProps> = ({ items, onUpdateQuantity, onRemoveItem, isUpdating = false }) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Shopping Cart ({items.length} items)</h2>
        {isUpdating && (
          <div className='flex items-center text-sm text-gray-500'>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
            Updating...
          </div>
        )}
      </div>

      <div className='space-y-4'>
        {items.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  )
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityIncrement = () => {
    if (item.quantity < item.maxQuantity) {
      onUpdateQuantity(item.id, item.quantity + 1)
    }
  }

  const handleQuantityDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value)
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0'>
        {/* Product Image */}
        <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg'>
          <Image src={item.product.image} alt={item.product.name} fill className='object-cover' sizes='96px' />
          {item.product.badge && (
            <span className='absolute left-1 top-1 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white'>
              {item.product.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className='flex-1 space-y-2'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='font-medium text-gray-900'>{item.product.name}</h3>
              {item.selectedVariant && (
                <p className='text-sm text-gray-500'>
                  {item.selectedVariant.name}: {item.selectedVariant.value}
                </p>
              )}
              <p className='text-sm text-gray-500'>SKU: {item.product.sku}</p>
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              className='ml-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500'
            >
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Price and Quantity */}
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center space-x-2'>
                <span className='text-lg font-semibold text-gray-900'>${item.price}</span>
                {item.product.originalPrice > item.price && (
                  <span className='text-sm text-gray-500 line-through'>${item.product.originalPrice}</span>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500'>Total: ${item.totalPrice}</span>
                {!item.inStock && (
                  <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className='flex items-center space-x-2'>
              <button
                onClick={handleQuantityDecrement}
                disabled={item.quantity <= 1}
                className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Icon name='AiOutlineMinus' className='h-4 w-4' />
              </button>
              <input
                type='number'
                min='1'
                max={item.maxQuantity}
                value={item.quantity}
                onChange={handleQuantityChange}
                className='w-16 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              />
              <button
                onClick={handleQuantityIncrement}
                disabled={item.quantity >= item.maxQuantity}
                className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Icon name='AiOutlinePlus' className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.maxQuantity && (
            <p className='text-sm text-orange-600'>Maximum quantity ({item.maxQuantity}) reached for this item.</p>
          )}
        </div>
      </div>
    </div>
  )
}
