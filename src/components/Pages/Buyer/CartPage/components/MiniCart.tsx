'use client'

import type { MiniCartProps, MiniCartItemProps } from '@/types/cart'

import React from 'react'

import Image from 'next/image'

import { Icon } from '@/components/common/icon'

export const MiniCart: React.FC<MiniCartProps> = ({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onViewCart,
  onCheckout,
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity' onClick={onClose} />

      {/* Mini Cart Sidebar */}
      <div className='fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out'>
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Shopping Cart ({cart.summary.itemCount})</h2>
            <button onClick={onClose} className='rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600'>
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Cart Items */}
          <div className='flex-1 overflow-y-auto'>
            {cart.items.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <Icon name='AiOutlineShopping' className='mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600'>Your cart is empty</p>
              </div>
            ) : (
              <div className='space-y-4 p-6'>
                {cart.items.map((item) => (
                  <MiniCartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className='border-t border-gray-200 p-6'>
              {/* Summary */}
              <div className='mb-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium text-gray-900'>${cart.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium text-gray-900'>
                    {cart.summary.shipping === 0 ? 'Free' : `$${cart.summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className='border-t border-gray-200 pt-2'>
                  <div className='flex justify-between font-semibold'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-gray-900'>${cart.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                <button
                  onClick={onCheckout}
                  className='w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90'
                >
                  Checkout Now
                </button>
                <button
                  onClick={onViewCart}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                >
                  View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const MiniCartItem: React.FC<MiniCartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
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

  return (
    <div className='flex space-x-3 rounded-lg border border-gray-200 p-3'>
      {/* Product Image */}
      <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
        <Image src={item.product.image} alt={item.product.name} fill className='object-cover' sizes='64px' />
        {item.product.badge && (
          <span className='absolute left-1 top-1 rounded-full bg-primary px-1 py-0.5 text-xs font-semibold text-white'>
            {item.product.badge}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <h3 className='truncate text-sm font-medium text-gray-900'>{item.product.name}</h3>
            {item.selectedVariant && (
              <p className='text-xs text-gray-500'>
                {item.selectedVariant.name}: {item.selectedVariant.value}
              </p>
            )}
            <p className='text-sm font-semibold text-gray-900'>${item.price}</p>
          </div>
          <button
            onClick={() => onRemoveItem(item.id)}
            className='ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500'
          >
            <Icon name='AiOutlineClose' className='h-4 w-4' />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex items-center space-x-1'>
            <button
              onClick={handleQuantityDecrement}
              disabled={item.quantity <= 1}
              className='rounded border border-gray-300 p-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Icon name='AiOutlineMinus' className='h-3 w-3' />
            </button>
            <span className='w-8 text-center text-sm'>{item.quantity}</span>
            <button
              onClick={handleQuantityIncrement}
              disabled={item.quantity >= item.maxQuantity}
              className='rounded border border-gray-300 p-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Icon name='AiOutlinePlus' className='h-3 w-3' />
            </button>
          </div>
          <span className='text-sm font-medium text-gray-900'>${item.totalPrice}</span>
        </div>
      </div>
    </div>
  )
}
