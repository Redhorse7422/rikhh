'use client'

import type { TableProps } from '@/components/ui/paginated-table/type'
import type { ShippingRate } from '@/types/shipping'

import { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { shippingHelpers } from '@/services/shipping.services'

import { ItemBasedCalculator } from './ItemBasedCalculator'
import { RateModal } from './RateModal'
import { useShippingRateFilter } from './ShippingRateFilterContext'

export const SectionRates = () => {
  const { filters } = useShippingRateFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const router = useRouter()
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [rateModalOpen, setRateModalOpen] = useState(false)

  const columns: TableProps['columns'] = [
    {
      key: 'name',
      header: 'Name',
      render: (name: any) => <span className='font-medium'>{name || 'Unnamed Rate'}</span>,
      isSort: true,
    },
    {
      key: 'rateType',
      header: 'Rate Type',
      render: (rateType: any, row) => (
        <div className='flex items-center gap-2'>
          <span>{shippingHelpers.getRateTypeLabel(rateType)}</span>
          {rateType === 'item_based' && (
            <Button
              label='Calculator'
              size='small'
              variant='outlinePrimary'
              onClick={() => {
                setSelectedRate(row)
                setCalculatorOpen(true)
              }}
            />
          )}
        </div>
      ),
      isSort: true,
    },
    {
      key: 'method',
      header: 'Method',
      render: (method: any) => method?.name || '-',
    },
    {
      key: 'baseRate',
      header: 'Base Rate',
      render: (baseRate: any) => <span className='font-mono'>${Number(baseRate)?.toFixed(2) || '0.00'}</span>,
      isSort: true,
    },
    {
      key: 'conditions',
      header: 'Conditions',
      render: (_, row) => {
        const conditionsUpdated = []
        if (row.minWeight && row.maxWeight) {
          conditionsUpdated.push(`${row.minWeight}-${row.maxWeight}kg`)
        }
        if (row.minOrderValue && row.maxOrderValue) {
          conditionsUpdated.push(`$${row.minOrderValue}-$${row.maxOrderValue}`)
        }
        if (row.firstItemCount && row.rateType === 'item_based') {
          conditionsUpdated.push(`${row.firstItemCount} items`)
        }
        return conditionsUpdated.length > 0 ? conditionsUpdated.join(', ') : '-'
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (isActive: any) => (
        <span className={isActive ? 'text-green-600' : 'text-red-500'}>{isActive ? 'Active' : 'Inactive'}</span>
      ),
      isSort: true,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (id: any) => (
        <div className='flex gap-2'>
          <Button
            label='Edit'
            size='small'
            variant='outlinePrimary'
            onClick={() => router.push(`/shipping/rates/${id}`)}
          />
          <Button
            label='Delete'
            size='small'
            variant='outlineDark'
            // TODO: Add delete logic/modal
            onClick={() => {}}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Shipping Rates</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Rate'
            variant='outlinePrimary'
            onClick={() => setRateModalOpen(true)}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/shipping/rates/all'
        columns={columns as any}
        initialQuery={{
          ...filters,
        }}
      />

      {/* Item-Based Calculator Modal */}
      {calculatorOpen && selectedRate && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl dark:bg-gray-dark'>
            <div className='flex-shrink-0 border-b border-gray-200 p-6 pb-4 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Item-Based Calculator - {selectedRate.name}
                </h2>
                <button
                  onClick={() => {
                    setCalculatorOpen(false)
                    setSelectedRate(null)
                  }}
                  className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                >
                  ✕
                </button>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto p-6 pt-4'>
              <ItemBasedCalculator rate={selectedRate} />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rate Modal */}
      <RateModal
        open={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        onSuccess={() => {
          setRateModalOpen(false)
          tableRef.current?.refetch()
        }}
      />
    </>
  )
}
