'use client'

import type { CartSummaryProps } from '@/types/cart'

import React, { useState } from 'react'

import { CouponForm } from './CouponForm'

export const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  onApplyCoupon,
  onProceedToCheckout,
  isLoading = false,
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState<string>('SAVE20')

  const handleApplyCoupon = (code: string) => {
    onApplyCoupon(code)
    setAppliedCoupon(code)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon('')
    // TODO: Implement remove coupon logic
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-6 text-xl font-bold text-gray-900'>Order Summary</h2>

      {/* Price Breakdown */}
      <div className='space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Subtotal ({summary.itemCount} items)</span>
          <span className='font-medium text-gray-900'>${summary.subtotal.toFixed(2)}</span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Shipping</span>
          <span className='font-medium text-gray-900'>
            {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Tax</span>
          <span className='font-medium text-gray-900'>${summary.tax.toFixed(2)}</span>
        </div>

        {summary.discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Discount</span>
            <span className='font-medium text-green-600'>-${summary.discount.toFixed(2)}</span>
          </div>
        )}

        <div className='border-t border-gray-200 pt-3'>
          <div className='flex justify-between text-lg font-bold'>
            <span className='text-gray-900'>Total</span>
            <span className='text-gray-900'>${summary.total.toFixed(2)}</span>
          </div>
          <p className='mt-1 text-sm text-gray-500'>Including tax and shipping</p>
        </div>
      </div>

      {/* Coupon Form */}
      <div className='mt-6'>
        <CouponForm
          onApplyCoupon={handleApplyCoupon}
          isLoading={isLoading}
          appliedCoupon={appliedCoupon}
          onRemoveCoupon={handleRemoveCoupon}
        />
      </div>

      {/* Checkout Button */}
      <div className='mt-6'>
        <button
          onClick={onProceedToCheckout}
          disabled={isLoading}
          className='w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
              Processing...
            </div>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className='mt-6 space-y-3 text-sm text-gray-500'>
        <div className='flex items-start space-x-2'>
          <div className='mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-green-100 p-0.5'>
            <div className='h-2 w-2 rounded-full bg-green-600'></div>
          </div>
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className='flex items-start space-x-2'>
          <div className='mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-green-100 p-0.5'>
            <div className='h-2 w-2 rounded-full bg-green-600'></div>
          </div>
          <span>30-day money-back guarantee</span>
        </div>
        <div className='flex items-start space-x-2'>
          <div className='mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-green-100 p-0.5'>
            <div className='h-2 w-2 rounded-full bg-green-600'></div>
          </div>
          <span>Free returns on all orders</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='mt-6 border-t border-gray-200 pt-4'>
        <p className='mb-3 text-sm font-medium text-gray-900'>We Accept</p>
        <div className='flex space-x-2'>
          <div className='h-8 w-12 rounded border border-gray-200 bg-gray-50'></div>
          <div className='h-8 w-12 rounded border border-gray-200 bg-gray-50'></div>
          <div className='h-8 w-12 rounded border border-gray-200 bg-gray-50'></div>
          <div className='h-8 w-12 rounded border border-gray-200 bg-gray-50'></div>
        </div>
      </div>
    </div>
  )
}
