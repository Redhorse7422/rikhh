'use client'

import type { ColumnOptions, DesktopTableProps } from './type'

import * as React from 'react'

import { ArrowUpIcon } from '@/assets/icons'
import { ChevronLeft, ChevronRight } from '@/components/Layouts/sidebar/icons'
import { Loader } from '@/components/common/Loading/Loader'
import { cn } from '@/libs/utils'

import { TableContext } from './Provider'


export function CustomTable<T>({
  dataSource,
  columns,
  isLoading,
  limit,
  page,
  sort,
  total,
  totalPages,
}: DesktopTableProps) {
  const { setPage, setLimit } = React.useContext(TableContext)
  const [sortField, setSortField] = React.useState(sort ?? 'name')
  const [inputPage, setInputPage] = React.useState(page.toString())

  const [sortFieldName, sortDirection] = sortField.startsWith('-') ? [sortField.slice(1), 'desc'] : [sortField, 'asc']

  const startItem = total > 0 ? (page - 1) * limit + 1 : 0
  const endItem = Math.min(page * limit, total)

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber)
    }
  }

  const handleSort = (field: string) => {
    const newSort = field === sortFieldName ? (sortDirection === 'asc' ? `-${field}` : field) : `-${field}`
    setSortField(newSort)
  }

  const renderCell = (row: T, column: ColumnOptions) => {
    const value = row[column.key as keyof T]
    if (value === null || value === undefined) return '-'
    if (typeof value === 'string' || typeof value === 'number') return value
    return JSON.stringify(value)
  }

  const PaginationControls = () => (
    <div className='flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 dark:border-dark-3 sm:flex-row'>
      <div className='text-sm text-neutral-500 dark:text-neutral-400'>
        Showing <span className='font-medium'>{startItem}</span> to <span className='font-medium'>{endItem}</span> of{' '}
        <span className='font-medium'>{total}</span> results
      </div>

      <div className='flex items-center space-x-1'>
        <button
          onClick={() => paginate(page - 1)}
          disabled={page === 1 || isLoading}
          className={cn(
            'rounded-md p-1.5',
            page === 1 || isLoading
              ? 'cursor-not-allowed text-neutral-400 dark:text-neutral-600'
              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2',
          )}
        >
          <ChevronLeft />
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum =
            totalPages <= 5 || page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i

          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              disabled={isLoading}
              className={cn(
                'flex h-8 min-w-[32px] items-center justify-center rounded-md text-sm',
                page === pageNum
                  ? 'dark:bg-primary-dark bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2',
                isLoading && 'cursor-not-allowed opacity-70',
              )}
            >
              {pageNum}
            </button>
          )
        })}

        {totalPages > 5 && page < totalPages - 2 && (
          <>
            <span className='px-2 text-neutral-500'>...</span>
            <button
              onClick={() => paginate(totalPages)}
              disabled={isLoading}
              className={cn(
                'flex h-8 min-w-[32px] items-center justify-center rounded-md text-sm',
                page === totalPages
                  ? 'dark:bg-primary-dark bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2',
                isLoading && 'cursor-not-allowed opacity-70',
              )}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => paginate(page + 1)}
          disabled={page === totalPages || isLoading || totalPages === 0}
          className={cn(
            'rounded-md p-1.5',
            page === totalPages || isLoading || totalPages === 0
              ? 'cursor-not-allowed text-neutral-400 dark:text-neutral-600'
              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2',
          )}
        >
          <ChevronRight />
        </button>

        {/* Page size selector */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className='ml-2 rounded border bg-white px-2 py-1 text-sm dark:bg-dark-2 dark:text-neutral-200'
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        {/* Direct page input */}
        <input
          type='number'
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => {
            const val = e.target.value
            if (val === '') {
              setInputPage('')
            } else {
              const num = Number(val)
              if (!isNaN(num) && num >= 1 && num <= totalPages) {
                setInputPage(val)
              }
            }
          }}
          onBlur={() => {
            const num = Number(inputPage)
            if (inputPage !== '' && num !== page) {
              paginate(num)
            } else {
              setInputPage(page.toString())
            }
          }}
          onKeyDown={(e) => {
            const num = Number(inputPage)
            if (e.key === 'Enter' && inputPage !== '' && num !== page) {
              paginate(num)
            }
          }}
          className='ml-2 w-16 rounded border bg-white px-2 py-1 text-sm dark:bg-dark-2 dark:text-neutral-200'
        />
        <span className='ml-1 text-xs text-neutral-500'>/ {totalPages}</span>
      </div>
    </div>
  )

  React.useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  return (
    <div className='overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
      <div className='relative min-h-[300px] overflow-x-auto'>
        {isLoading ? (
          <div className='absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-dark/80'>
            <Loader size={50} />
          </div>
        ) : (
          <table className='w-full caption-bottom text-sm'>
            <thead className='bg-gray-50 dark:bg-dark-2'>
              <tr className='border-b border-t border-gray-200 dark:border-dark-3'>
                {columns.map((column) => (
                  <th
                    key={column.key as string}
                    className={cn(
                      'h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400 [&:has([role=checkbox])]:pr-0',
                      column.isSort && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3',
                      column.className,
                    )}
                    onClick={() => column.isSort && handleSort(column.key as string)}
                  >
                    <div className='flex items-center gap-1'>
                      {column.header}
                      {column.isSort && sortFieldName === column.key && (
                        <ArrowUpIcon className={cn('transition-transform', sortDirection === 'asc' && 'rotate-180')} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {dataSource.length > 0 ? (
                dataSource.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className='border-b transition-colors hover:bg-neutral-100/50 dark:hover:bg-dark-2'
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key as string}
                        className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', column.className)}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='p-8 text-center text-neutral-500 dark:text-neutral-400'>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <PaginationControls />
    </div>
  )
}
