'use client'

import type { ShippingRate } from '@/types/shipping'

import { useState } from 'react'

import { TextField } from '@/components/FormElements/TextInput/TextField'
import { shippingHelpers } from '@/services/shipping.services'

interface ItemBasedCalculatorProps {
  rate: ShippingRate
  className?: string
}

export const ItemBasedCalculator = ({ rate, className = '' }: ItemBasedCalculatorProps) => {
  const [itemCount, setItemCount] = useState(1)

  const calculateCost = (items: number) => {
    if (!rate || rate.rateType !== 'item_based') return 0

    const firstItemCount = Number(rate.firstItemCount || 0)
    const baseRate = Number(rate.baseRate || 0)
    const additionalRate = Number(rate.additionalItemRate || 0)

    // If items are within or equal to the first item count, just return base rate
    if (items <= firstItemCount) {
      return baseRate
    }

    // If items exceed first item count, calculate additional items
    const additionalItems = items - firstItemCount
    const totalCost = baseRate + (additionalItems * additionalRate)

    return totalCost
  }

  const cost = calculateCost(itemCount)
  const firstItemCount = Number(rate.firstItemCount || 0)
  const hasExceededLimit = itemCount > firstItemCount
  const additionalItems = hasExceededLimit ? itemCount - firstItemCount : 0
  const additionalCost = additionalItems * Number(rate.additionalItemRate || 0)

  return (
    <div className={`rounded-lg border bg-gray-50 p-6 dark:bg-gray-800 ${className}`}>
      <h3 className='mb-4 text-lg font-semibold'>Item-Based Pricing Calculator</h3>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-medium'>Number of Items</label>
          <input
            type='number'
            min='1'
            value={itemCount}
            onChange={(e) => setItemCount(Math.max(1, Number(e.target.value)))}
            className='w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-700'
          />
        </div>

        <div className='rounded-md border bg-white p-4 dark:bg-gray-700'>
          <h4 className='mb-2 font-medium'>Cost Breakdown</h4>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span>Base Rate (covers first {firstItemCount} items):</span>
              <span>${Number(rate.baseRate || 0).toFixed(2)}</span>
            </div>
            {hasExceededLimit && (
              <div className='flex justify-between'>
                <span>
                  Additional Items ({additionalItems} items × ${Number(rate.additionalItemRate || 0).toFixed(2)} each):
                </span>
                <span>${additionalCost.toFixed(2)}</span>
              </div>
            )}
            <div className='flex justify-between border-t pt-2 font-semibold'>
              <span>Total Cost:</span>
              <span>${Number(cost).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {rate.maxItems && (
          <div className='text-sm text-gray-600 dark:text-gray-400'>Maximum items allowed: {rate.maxItems}</div>
        )}
      </div>
    </div>
  )
}
