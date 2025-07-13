'use client'

import type { EmptyCartProps } from '@/types/cart'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      {/* Empty Cart Icon */}
      <div className='mb-6 rounded-full bg-gray-100 p-8'>
        <Icon name='AiOutlineShopping' className='h-16 w-16 text-gray-400' />
      </div>

      {/* Empty Cart Message */}
      <h2 className='mb-4 text-2xl font-bold text-gray-900'>Your cart is empty</h2>
      <p className='mb-8 max-w-md text-gray-600'>
        Looks like you haven&apos;t added any items to your cart yet. Start shopping to discover amazing products!
      </p>

      {/* Continue Shopping Button */}
      <button
        onClick={onContinueShopping}
        className='rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90'
      >
        Continue Shopping
      </button>

      {/* Additional Info */}
      <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
            <Icon name='AiOutlineCheck' className='h-6 w-6 text-blue-600' />
          </div>
          <h3 className='mb-2 font-medium text-gray-900'>Fast Shipping</h3>
          <p className='text-sm text-gray-600'>Calculated at checkout</p>
        </div>

        <div className='text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
            <Icon name='AiOutlineCheck' className='h-6 w-6 text-green-600' />
          </div>
          <h3 className='mb-2 font-medium text-gray-900'>Easy Returns</h3>
          <p className='text-sm text-gray-600'>30-day money-back guarantee</p>
        </div>

        <div className='text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
            <Icon name='AiOutlineCheck' className='h-6 w-6 text-purple-600' />
          </div>
          <h3 className='mb-2 font-medium text-gray-900'>Secure Checkout</h3>
          <p className='text-sm text-gray-600'>SSL encrypted payment</p>
        </div>
      </div>
    </div>
  )
}
