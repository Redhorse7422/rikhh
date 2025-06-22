'use client'

import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { useCategoryFilter } from './CategoryFilterContext'
import { useColumn } from './useColumn'
import { PaginatedTable } from '@/components/ui/paginated-table'
import { SmartColumn } from '@/components/ui/smart-paginated-table/types'

export const SectionCategories = () => {
  const { filters } = useCategoryFilter()
  const { columns } = useColumn()
  return (
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
  )
}
