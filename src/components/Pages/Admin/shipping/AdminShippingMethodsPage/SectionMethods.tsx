'use client'
import type { TableProps } from '@/components/ui/paginated-table/type'
import type { SmartColumn } from '@/components/ui/smart-paginated-table/types'
import type { ShippingMethod } from '@/types/shipping'

import { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { shippingHelpers } from '@/services/shipping.services'

import { MethodModal } from './MethodModal'
import { useShippingMethodFilter } from './ShippingMethodFilterContext'

export const SectionMethods = () => {
  const { filters } = useShippingMethodFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null)

  const columns: TableProps['columns'] = [
    {
      key: 'name',
      header: 'Name',
      render: (name: any) => <span className='font-medium'>{name}</span>,
      isSort: true,
    },
    {
      key: 'methodType',
      header: 'Method Type',
      render: (methodType: any) => shippingHelpers.getMethodTypeLabel(methodType),
      isSort: true,
    },
    {
      key: 'carrierType',
      header: 'Carrier Type',
      render: (carrierType: any) => shippingHelpers.getCarrierTypeLabel(carrierType),
      isSort: true,
    },
    {
      key: 'zone',
      header: 'Zone',
      render: (zone: any) => zone?.name || '-',
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
      key: 'priority',
      header: 'Priority',
      render: (priority: any) => priority,
      isSort: true,
    },
    {
      key: 'isDefault',
      header: 'Default',
      render: (isDefault: any) => (
        <span className={isDefault ? 'text-blue-600' : 'text-gray-500'}>{isDefault ? 'Yes' : 'No'}</span>
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
            onClick={() => router.push(`/shipping/methods/${id}`)}
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
        <p className='text-lg font-semibold'>Shipping Methods</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Method'
            variant='outlinePrimary'
            onClick={() => {
              setSelectedMethod(null)
              setModalOpen(true)
            }}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/shipping/methods/all'
        columns={columns as SmartColumn[]}
        initialQuery={{
          ...filters,
        }}
      />
      <MethodModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedMethod(null)
        }}
        onSuccess={() => {
          tableRef.current?.refetch()
        }}
        method={selectedMethod}
      />
    </>
  )
}
