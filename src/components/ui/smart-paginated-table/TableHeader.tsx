import React from 'react'
import { SmartColumn } from './types'

interface TableHeaderProps {
  columns: SmartColumn[]
  sort: string
  handleSort: (col: SmartColumn) => void
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, sort, handleSort }) => (
  <thead className='bg-gray-50 dark:bg-dark-2'>
    <tr className='border-b border-t border-gray-200 dark:border-dark-3'>
      {columns.map((col) => (
        <th
          key={col.key}
          className={`h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400 ${col.isSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3' : ''} ${col.className || ''}`}
          onClick={() => handleSort(col)}
        >
          <div className='flex items-center gap-1'>
            {col.header}
            {col.isSort && (
              <span>
                {sort === col.key ? '▲' : sort === `-${col.key}` ? '▼' : ''}
              </span>
            )}
          </div>
        </th>
      ))}
    </tr>
  </thead>
) 