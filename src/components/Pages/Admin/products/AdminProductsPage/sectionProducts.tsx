'use client'

import { useRef } from 'react'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { useProductFilter } from './ProductFilterContext'
import { useColumn } from './useColumn'
import { SmartColumn } from '@/components/ui/smart-paginated-table/types'
import { Button } from '@/components/common/Button'
import { useRouter } from 'next/navigation'

export const SectionProducts = () => {
  const { filters } = useProductFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const { columns, modal } = useColumn(() => tableRef.current?.refetch())
  const router = useRouter()
  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Products</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Product'
            variant='outlinePrimary'
            // color='primary'
            onClick={() => router.push('/products/add')}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/products/all'
        columns={columns as SmartColumn[]}
        initialQuery={{
          sort: '-updatedAt',
          filters: {
            ...filters,
          },
        }}
      />
      {modal}
    </>
  )
}
