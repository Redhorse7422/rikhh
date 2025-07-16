import type { OrderItem } from '@/types/order'

import React from 'react'

interface OrderItemsTableProps {
  items: OrderItem[]
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  if (!items || items.length === 0) return null

  // Calculate total
  const total = items.reduce((sum, item) => sum + Number(item.totalPrice), 0)

  return (
    <div className='mb-6 overflow-hidden rounded-lg border-l-4 border-primary bg-white p-0 shadow-lg'>
      <div className='border-b bg-gradient-to-r from-primary/10 to-blue-50 px-6 py-4'>
        <div className='text-lg font-semibold'>Products in Order</div>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='bg-gray-100 text-gray-700'>
              <th className='px-4 py-2 text-left font-medium'>Product</th>
              <th className='px-4 py-2 text-left font-medium'>Variants</th>
              <th className='px-4 py-2 text-right font-medium'>Qty</th>
              <th className='px-4 py-2 text-right font-medium'>Unit Price</th>
              <th className='px-4 py-2 text-right font-medium'>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId} className='border-b transition last:border-b-0 hover:bg-gray-50'>
                <td className='flex items-center gap-3 px-4 py-3'>
                  {/* Placeholder for product image if available in future */}
                  <div className='flex h-10 w-10 items-center justify-center rounded bg-gray-100 font-bold text-gray-400'>
                    <span>{item.productName.charAt(0)}</span>
                  </div>
                  <div>
                    <div className='font-medium text-gray-900'>{item.productName}</div>
                  </div>
                </td>
                <td className='px-4 py-3 text-gray-700'>
                  {item.selectedVariants && item.selectedVariants.length > 0 ? (
                    <ul className='space-y-1'>
                      {item.selectedVariants.map((v, i) => (
                        <li key={i} className='text-xs text-gray-500'>
                          <span className='font-medium'>{v.name}:</span> {v.value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className='text-xs text-gray-400'>—</span>
                  )}
                </td>
                <td className='px-4 py-3 text-right'>{item.quantity}</td>
                <td className='px-4 py-3 text-right'>${Number(item.unitPrice).toFixed(2)}</td>
                <td className='px-4 py-3 text-right font-semibold'>${Number(item.totalPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className='bg-gray-50'>
              <td colSpan={4} className='px-4 py-3 text-right font-bold text-gray-700'>
                Products Total
              </td>
              <td className='px-4 py-3 text-right text-lg font-bold text-primary'>${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
