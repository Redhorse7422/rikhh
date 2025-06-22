import React from 'react'

interface PaginationControlsProps {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  isLoading: boolean
  inputPage: string
  setInputPage: (val: string) => void
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  setPage,
  setPageSize,
  isLoading,
  inputPage,
  setInputPage,
}) => {
  const handlePageInput = (val: string) => {
    setInputPage(val)
    const num = Number(val)
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num)
    }
  }
  return (
    <div className='flex items-center space-x-1'>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || isLoading} className='rounded-md p-1.5'>{'<'}</button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let pageNum = totalPages <= 5 || page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            disabled={isLoading}
            className={`flex h-8 min-w-[32px] items-center justify-center rounded-md text-sm ${page === pageNum ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2'} ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {pageNum}
          </button>
        )
      })}
      {totalPages > 5 && page < totalPages - 2 && (
        <>
          <span className='px-2 text-neutral-500'>...</span>
          <button
            onClick={() => setPage(totalPages)}
            disabled={isLoading}
            className={`flex h-8 min-w-[32px] items-center justify-center rounded-md text-sm ${page === totalPages ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-dark-2'} ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || isLoading || totalPages === 0} className='rounded-md p-1.5'>{'>'}</button>
      {/* Page size selector */}
      <select
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
        className='ml-2 border rounded px-2 py-1 text-sm bg-white dark:bg-dark-2 dark:text-neutral-200'
      >
        {pageSizeOptions.map(size => (
          <option key={size} value={size}>{size} / page</option>
        ))}
      </select>
      {/* Direct page input */}
      <input
        type='number'
        min={1}
        max={totalPages}
        value={inputPage}
        onChange={e => setInputPage(e.target.value)}
        onBlur={() => handlePageInput(inputPage)}
        onKeyDown={e => {
          if (e.key === 'Enter') handlePageInput(inputPage)
        }}
        className='w-16 border rounded px-2 py-1 ml-2 text-sm bg-white dark:bg-dark-2 dark:text-neutral-200'
      />
      <span className='ml-1 text-xs text-neutral-500'>/ {totalPages}</span>
    </div>
  )
} 