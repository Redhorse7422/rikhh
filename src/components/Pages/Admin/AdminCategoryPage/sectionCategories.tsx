'use client'

import { useCategoryFilter } from './CategoryFilterContext'
import { useColumn } from './useColumn'
import { PaginatedTable } from '@/components/ui/paginated-table'

export const SectionCategories = () => {
  const { filters } = useCategoryFilter()
  const { columns } = useColumn()
  return (
    <PaginatedTable
      path='/v1/categories'
      columns={columns}
      initialQuery={{
        sort: '-updatedAt',
        filters: {
          ...filters,
        },
      }}
    />
  )
}
