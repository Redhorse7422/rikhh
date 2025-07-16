'use client'

import type { CouponFormProps } from '@/types/cart'

import React, { useState } from 'react'

import { Icon } from '@/components/common/icon'

export const CouponForm: React.FC<CouponFormProps> = ({
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
  appliedCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.trim()) {
      await onApplyCoupon(couponCode.trim())
      setCouponCode('')
      setIsExpanded(false)
    }
  }

  const handleRemove = () => {
    onRemoveCoupon()
  }

  if (appliedCoupon) {
    return (
      <div className='rounded-lg bg-green-50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Icon name='AiOutlineCheckCircle' className='h-5 w-5 text-green-600' />
            <div>
              <span className='text-sm font-medium text-green-800'>
                Coupon {appliedCoupon.code} applied successfully!
              </span>
              {appliedCoupon.name && <p className='text-xs text-green-700'>{appliedCoupon.name}</p>}
              <p className='text-xs text-green-700'>You saved ${appliedCoupon.discountAmount.toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleRemove} className='text-sm font-medium text-green-600 hover:text-green-800'>
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900'
      >
        <span>Have a coupon code?</span>
        <Icon name={isExpanded ? 'AiOutlineMinus' : 'AiOutlinePlus'} className='h-4 w-4' />
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder='Enter coupon code'
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={!couponCode.trim() || isLoading}
              className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
              ) : (
                'Apply'
              )}
            </button>
          </div>
          <p className='text-xs text-gray-500'>Enter your coupon code to get a discount on your order</p>
        </form>
      )}
    </div>
  )
}
