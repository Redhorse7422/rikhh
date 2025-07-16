import React from 'react'

interface OrderTotalsProps {
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
}

export const OrderTotals: React.FC<OrderTotalsProps> = ({
  subtotal,
  taxAmount,
  shippingAmount,
  discountAmount,
  totalAmount,
}) => (
  <div className='flex flex-col items-end gap-1 text-sm'>
    <div>
      Subtotal: <span className='font-semibold'>${Number(subtotal).toFixed(2)}</span>
    </div>
    <div>
      Tax: <span className='font-semibold'>${Number(taxAmount).toFixed(2)}</span>
    </div>
    <div>
      Shipping: <span className='font-semibold'>${Number(shippingAmount).toFixed(2)}</span>
    </div>
    <div>
      Discount: <span className='font-semibold text-green-700'>-${Number(discountAmount).toFixed(2)}</span>
    </div>
    <div className='text-lg font-bold'>Total: ${Number(totalAmount).toFixed(2)}</div>
  </div>
)
