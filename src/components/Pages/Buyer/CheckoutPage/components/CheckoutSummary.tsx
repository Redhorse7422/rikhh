import React from 'react'

import { useCart } from '@/contexts/CartContext'

export const CheckoutSummary: React.FC = () => {
  const { cart } = useCart()
  return (
    <aside className='rounded bg-white p-6 shadow'>
      <h3 className='mb-4 text-lg font-semibold'>Order Summary</h3>
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <span>Subtotal</span>
          <span>${cart.summary.subtotal.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>Shipping</span>
          <span>${cart.summary.shipping.toFixed(2)}</span>
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
          <span>${cart.summary.total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  )
}
