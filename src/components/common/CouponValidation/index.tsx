import type { CouponValidationRequest, CouponValidationResponse } from '@/types/coupon'

import { useState } from 'react'

import { Button } from '@/components/common/Button'
import { validateCoupon } from '@/services/coupon.services'

interface CouponValidationProps {
  cartTotal: number
  productIds?: string[]
  categoryIds?: string[]
  onCouponApplied?: (coupon: CouponValidationResponse) => void
  onCouponRemoved?: () => void
  appliedCoupon?: CouponValidationResponse | null
}

export const CouponValidation = ({
  cartTotal,
  productIds = [],
  categoryIds = [],
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
}: CouponValidationProps) => {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setIsValidating(true)
    setError(null)

    try {
      const validationRequest: CouponValidationRequest = {
        code: couponCode.trim().toUpperCase(),
        cartTotal,
        productIds,
        categoryIds,
      }

      const response = await validateCoupon(validationRequest)

      if (response.success && response.data.valid) {
        onCouponApplied?.(response.data)
        setCouponCode('')
        setError(null)
      } else {
        setError(response.data.message || 'Invalid coupon code')
      }
    } catch (err) {
      console.error('Error validating coupon:', err)
      setError('Failed to validate coupon. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved?.()
    setCouponCode('')
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidateCoupon()
    }
  }

  return (
    <div className='space-y-4'>
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className='rounded-lg bg-green-50 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-800'>Coupon Applied: {appliedCoupon.coupon?.code}</p>
                <p className='text-sm text-green-700'>You saved ${appliedCoupon.discountAmount?.toFixed(2)}</p>
              </div>
            </div>
            <Button label='Remove' variant='outlinePrimary' onClick={handleRemoveCoupon} className='text-sm' />
          </div>
        </div>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className='space-y-3'>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-700'>Coupon Code</label>
                <input
                  type='text'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Enter coupon code'
                  className='block w-full rounded-md border-gray-300 uppercase shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
              </div>
            </div>
            <div className='flex items-end'>
              <Button
                label={isValidating ? 'Validating...' : 'Apply'}
                onClick={handleValidateCoupon}
                disabled={isValidating || !couponCode.trim()}
                className='whitespace-nowrap'
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='rounded-lg bg-red-50 p-3'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-red-800'>{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coupon Tips */}
      <div className='rounded-lg bg-blue-50 p-3'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <p className='text-sm text-blue-800'>Have a coupon code? Enter it above to get a discount on your order.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouponValidation
