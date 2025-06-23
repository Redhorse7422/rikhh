import React, { useEffect, useMemo, useState } from 'react'
import { SmartPaginatedTableProps, SmartTableResponse } from './types'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { PaginationControls } from './PaginationControls'
import { useApi } from '@/hooks/useApi'

export const SmartPaginatedTable: React.FC<SmartPaginatedTableProps> = ({
  path,
  columns,
  initialQuery = {},
  sort: initialSort = '',
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  refetchOnWindowFocus = false,
}) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sort, setSort] = useState(initialSort)
  const [internalFilters, setInternalFilters] = useState(initialQuery)
  const [inputPage, setInputPage] = useState('1')

  const { getDataSource } = useApi()

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1)
    setInputPage('1')
  }, [internalFilters, sort, pageSize])

  // Sync inputPage with page
  useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit: pageSize,
      ...internalFilters,
    }
    if (sort) params.sort = sort
    return params
  }, [page, pageSize, internalFilters, sort])

  // Fetch data using getDataSource
  const { data = { data: [], meta: { total: 0, totalPages: 1 } }, isLoading, isFetching, refetch, isFetched } = getDataSource<SmartTableResponse>({
    path,
    query: queryParams,
    refetchOnWindowFocus,
  })

  // Extract data
  const rows = data.data || []
  const total = data.meta?.total || 0
  const totalPages = data.meta?.totalPages || 1

  // Pagination logic
  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0
  const endItem = Math.min(page * pageSize, total)

  // Sorting handler
  const handleSort = (col: any) => {
    if (!col.isSort) return
    setSort((prev) => {
      if (prev === col.key) return `-${col.key}`
      if (prev === `-${col.key}`) return col.key
      return col.key
    })
  }

  useEffect(() => {
    setInternalFilters(initialQuery);
    setPage(1);
    setInputPage('1');
  }, [initialQuery]);

  return (
    <div className='overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
      <div className='relative min-h-[300px] overflow-x-auto'>
        {(isLoading || isFetching) && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-dark/80 z-10'>
            <span>Loading...</span>
          </div>
        )}
        <table className='w-full caption-bottom text-sm'>
          <TableHeader columns={columns} sort={sort} handleSort={handleSort} />
          <TableBody columns={columns} rows={rows} />
        </table>
      </div>
      {/* Pagination Controls */}
      <div className='flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 dark:border-dark-3 sm:flex-row'>
        <div className='text-sm text-neutral-500 dark:text-neutral-400'>
          Showing <span className='font-medium'>{startItem}</span> to <span className='font-medium'>{endItem}</span> of{' '}
          <span className='font-medium'>{total}</span> results
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          setPage={setPage}
          setPageSize={setPageSize}
          isLoading={isLoading}
          inputPage={inputPage}
          setInputPage={setInputPage}
        />
      </div>
    </div>
  )
} 