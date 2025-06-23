'use client'

import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { useCategoryFilter } from './CategoryFilterContext'
import { useColumn } from './useColumn'
import { SmartColumn } from '@/components/ui/smart-paginated-table/types'
import { Button } from '@/components/common/Button'
import { useRouter } from 'next/navigation'

export const SectionCategories = () => {
  const { filters } = useCategoryFilter()
  const { columns } = useColumn()
  const router = useRouter()
  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Categories</p>
        <div className='flex gap-3'>
          <Button
            // icon='AiOutlineDownload'
            label='Add Category'
            // variant='outlined'
            color='primary'
            onClick={() => router.push('/categories/add')}
          />
        </div>
      </div>
      <SmartPaginatedTable
        path='/v1/categories'
        columns={columns as SmartColumn[]}
        initialQuery={{
          sort: '-updatedAt',
          filters: {
            ...filters,
          },
        }}
      />
    </>
  )
}
