'use client'

import type { SmartColumn } from '@/components/ui/smart-paginated-table/types'

import { useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'

import { useCategoryFilter } from './CategoryFilterContext'
import { useColumn } from './useColumn'

export const SectionCategories = () => {
  const { filters } = useCategoryFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const { columns, modal } = useColumn(() => tableRef.current?.refetch())
  const router = useRouter()
  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Categories</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Category'
            variant='outlinePrimary'
            // color='primary'
            onClick={() => router.push('/categories/add')}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/categories/all'
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
