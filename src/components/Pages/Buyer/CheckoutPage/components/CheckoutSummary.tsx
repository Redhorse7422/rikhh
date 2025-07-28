import React from 'react'

import Image from 'next/image'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
// import { useCart } from '@/contexts/CartContext'
import useToast from '@/hooks/useToast'
import { applyCouponToCheckout, removeCouponFromCheckout } from '@/services/coupon.services'

import { useCheckout } from '../context/CheckoutContext'

import { CheckoutCouponForm } from './CheckoutCouponForm'

export const CheckoutSummary: React.FC = () => {
  // const { cart, updateSummaryAndCoupon } = useCart()
  const { selectedShippingOption, checkoutId } = useCheckout()
  const { showToast } = useToast()

  // Calculate shipping cost based on selected option breakdown or fallback to price field
  // const shippingCost = selectedShippingOption
  //   ? selectedShippingOption.breakdown
  //     ? Number(selectedShippingOption.breakdown.baseRate) + Number(selectedShippingOption.breakdown.additionalCost)
  //     : Number(selectedShippingOption.price) || 0
  //   : cart.summary.shipping

  // Calculate total with actual shipping cost
  // const total = cart.summary.subtotal + shippingCost + cart.summary.tax - cart.summary.discount

  const handleApplyCoupon = async (code: string) => {
    if (!checkoutId) {
      showToast('Please complete checkout setup first', 'error')
      return
    }

    try {
      // const response = await applyCouponToCheckout({
      //   checkoutId,
      //   couponCode: code.toUpperCase(),
      //   items: cart.items.map((item) => ({
      //     productId: item.product.id,
      //     quantity: item.quantity,
      //     unitPrice: item.price,
      //   })),
      // })
      // Use response.data for the actual result
      // const data = response as any
      // if (data?.couponApplied) {
      //   // Map API response fields to cart summary fields
      //   const summary = data.updatedSummary
      //   updateSummaryAndCoupon(
      //     {
      //       subtotal: summary.subtotal,
      //       tax: summary.taxAmount,
      //       shipping: summary.shippingAmount,
      //       discount: summary.discountAmount,
      //       total: summary.totalAmount,
      //       itemCount: summary.itemCount,
      //       appliedCoupon: {
      //         ...data.coupon,
      //         appliedAt: new Date().toISOString(),
      //       },
      //     },
      //     {
      //       ...data.coupon,
      //       appliedAt: new Date().toISOString(),
      //     },
      //   )
      //   showToast(`Coupon "${code}" applied successfully!`, 'success')
      // } else {
      //   console.log(data)
      //   showToast('Failed to apply coupon. Please try again.', 'error')
      // }
    } catch (error: any) {
      console.log('Full error object:', error)
      console.log('Error response:', error?.response)
      console.log('Error response data:', error?.response?.data)

      const message =
        error?.error?.message || // This works for { error: { message: "..."} }
        error?.message ||
        'Failed to apply coupon. Please try again.'

      showToast(message, 'error')
    }
  }

  const handleRemoveCoupon = async () => {
    if (!checkoutId) {
      showToast('Please complete checkout setup first', 'error')
      return
    }

    try {
      await removeCouponFromCheckout(checkoutId)
      showToast('Coupon removed successfully', 'success')
    } catch (error) {
      console.error('Error removing coupon:', error)
      showToast('Failed to remove coupon. Please try again.', 'error')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>Order Summary</h2>

        {/* <div className='space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Subtotal ({cart.summary.itemCount} items)</span>
            <span className='font-medium text-gray-900'>${cart.summary.subtotal.toFixed(2)}</span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Shipping</span>
            <span className='font-medium text-gray-900'>
              {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}
            </span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Tax</span>
            <span className='font-medium text-gray-900'>${cart.summary.tax.toFixed(2)}</span>
          </div>

          {cart.summary.discount > 0 && (
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Discount</span>
              <span className='font-medium text-green-600'>-${cart.summary.discount.toFixed(2)}</span>
            </div>
          )}

          <div className='border-t border-gray-200 pt-3'>
            <div className='flex justify-between text-lg font-bold'>
              <span className='text-gray-900'>Total</span>
              <span className='text-gray-900'>${total.toFixed(2)}</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Coupon Form */}
      {/* {cart.summary.appliedCoupon ? (
        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Icon name='AiOutlineCheckCircle' className='h-5 w-5 text-green-600' />
              <div>
                <p className='text-sm font-medium text-green-800'>Coupon {cart.summary.appliedCoupon.code} applied</p>
                {cart.summary.appliedCoupon.name && (
                  <p className='text-xs text-green-700'>{cart.summary.appliedCoupon.name}</p>
                )}
                <p className='text-xs text-green-700'>
                  Discount: ${cart.summary.appliedCoupon.discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
        
            <Button
              label='Remove'
              variant='outlinePrimary'
              size='small'
              onClick={handleRemoveCoupon}
              disabled={!checkoutId}
            />
          </div>
        </div>
      ) : (
        checkoutId && (
          <CheckoutCouponForm
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            appliedCoupon={cart.summary.appliedCoupon}
            disabled={!checkoutId}
          />
        )
      )} */}

      {/* Order Items */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Order Items</h3>
        <div className='space-y-3'>
          {/* {cart.items.map((item) => (
            <div key={item.id} className='flex items-center space-x-3'>
              <div className='flex-shrink-0'>
                <Image
                  src={item.product.thumbnailImg || '/images/no-image.png'}
                  alt={item.product.name}
                  className='h-12 w-12 rounded-md object-cover'
                  width={60}
                  height={60}
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-gray-900'>{item.product.name}</p>
                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
              </div>
              <div className='flex-shrink-0'>
                <p className='text-sm font-medium text-gray-900'>${item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  )
}
