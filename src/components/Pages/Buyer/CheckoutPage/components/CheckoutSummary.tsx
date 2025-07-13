import React from 'react'

import { useCart } from '@/contexts/CartContext'

import { useCheckout } from '../context/CheckoutContext'

export const CheckoutSummary: React.FC = () => {
  const { cart } = useCart()
  const { selectedShippingOption } = useCheckout()
  
  // Calculate shipping cost based on selected option breakdown or fallback to price field
  const shippingCost = selectedShippingOption 
    ? (selectedShippingOption.breakdown 
        ? Number(selectedShippingOption.breakdown.baseRate) + Number(selectedShippingOption.breakdown.additionalCost)
        : Number(selectedShippingOption.price) || 0)
    : cart.summary.shipping
  
  // Calculate total with actual shipping cost
  const total = cart.summary.subtotal + shippingCost + cart.summary.tax - cart.summary.discount
  
  return (
    <aside className='rounded bg-white p-6 shadow'>
      <h3 className='mb-4 text-lg font-semibold'>Order Summary</h3>
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <span>Subtotal</span>
          <span>${cart.summary.subtotal.toFixed(2)}</span>
        </div>
        
        {/* Shipping section */}
        <div className='space-y-1'>
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          {selectedShippingOption && (
            <div className='text-sm text-gray-600 pl-4'>
              {selectedShippingOption.name} - {selectedShippingOption.estimatedDays} day{selectedShippingOption.estimatedDays !== 1 ? 's' : ''} delivery
            </div>
          )}
        </div>
        
        <div className='flex justify-between'>
          <span>Tax</span>
          <span>${cart.summary.tax.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>Discount</span>
          <span>-${cart.summary.discount.toFixed(2)}</span>
        </div>
        <hr />
        <div className='flex justify-between font-bold text-primary'>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  )
}
