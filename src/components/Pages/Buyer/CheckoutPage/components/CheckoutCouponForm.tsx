'use client'

import type { AppliedCoupon } from '@/types/coupon'

import React, { useState } from 'react'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'

interface CheckoutCouponFormProps {
  onApplyCoupon: (code: string) => Promise<void>
  onRemoveCoupon: () => void
  appliedCoupon?: AppliedCoupon
  isLoading?: boolean
  disabled?: boolean
}

export const CheckoutCouponForm: React.FC<CheckoutCouponFormProps> = ({
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  isLoading = false,
  disabled = false,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  if (appliedCoupon) {
    return (
      <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Icon name='AiOutlineCheckCircle' className='h-5 w-5 text-green-600' />
            <div>
              <p className='text-sm font-medium text-green-800'>Coupon {appliedCoupon.code} applied</p>
              {appliedCoupon.name && <p className='text-xs text-green-700'>{appliedCoupon.name}</p>}
              <p className='text-xs text-green-700'>Discount: ${appliedCoupon.discountAmount.toFixed(2)}</p>
            </div>
          </div>
          <Button label='Remove' variant='outlinePrimary' size='small' onClick={handleRemove} disabled={disabled} />
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 p-4'>
      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900'
        disabled={disabled}
      >
        <span>Have a coupon code?</span>
        <Icon name={isExpanded ? 'AiOutlineMinus' : 'AiOutlinePlus'} className='h-4 w-4' />
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className='mt-4 space-y-3'>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Enter coupon code'
              className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              disabled={isLoading || disabled}
            />
            <Button
              type='submit'
              label={isLoading ? 'Applying...' : 'Apply'}
              disabled={!couponCode.trim() || isLoading || disabled}
              size='small'
            />
          </div>
          <p className='text-xs text-gray-500'>Enter your coupon code to apply discount to your order</p>
        </form>
      )}
    </div>
  )
}
