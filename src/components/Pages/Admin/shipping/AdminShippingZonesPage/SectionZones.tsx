'use client'

import type { TableProps } from '@/components/ui/paginated-table/type'
import type { SmartColumn } from '@/components/ui/smart-paginated-table/types'
import type { ShippingZone } from '@/types/shipping'

import { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { shippingHelpers } from '@/services/shipping.services'

import { useShippingZoneFilter } from './ShippingZoneFilterContext'
import { ZoneModal } from './ZoneModal'

export const SectionZones = () => {
  const { filters } = useShippingZoneFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null)

  const columns: TableProps['columns'] = [
    {
      key: 'name',
      header: 'Name',
      render: (name: any) => {
        return <span className='font-medium'>{name}</span>
      },
      isSort: true,
    },
    {
      key: 'zoneType',
      header: 'Type',
      render: (zoneType: any) => shippingHelpers.getZoneTypeLabel(zoneType),
      isSort: true,
    },
    {
      key: 'countries',
      header: 'Countries',
      render: (countries: any) => (countries && countries.length > 0 ? countries.join(', ') : '-'),
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
      key: 'id',
      header: 'Actions',
      render: (id: any) => (
        <div className='flex gap-2'>
          <Button
            label='Edit'
            size='small'
            variant='outlinePrimary'
            onClick={() => router.push(`/shipping/zones/${id}`)}
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
        <p className='text-lg font-semibold'>Shipping Zones</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Zone'
            variant='outlinePrimary'
            onClick={() => {
              setSelectedZone(null)
              setModalOpen(true)
            }}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/shipping/zones/all'
        columns={columns as SmartColumn[]}
        initialQuery={{
          ...filters,
        }}
      />
      <ZoneModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedZone(null)
        }}
        onSuccess={() => {
          tableRef.current?.refetch()
        }}
        zone={selectedZone}
      />
    </>
  )
}
