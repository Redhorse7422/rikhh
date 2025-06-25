import type { SmartColumn } from './types'

import React from 'react'

interface TableBodyProps {
  columns: SmartColumn[]
  rows: Record<string, unknown>[]
}

export const TableBody: React.FC<TableBodyProps> = ({ columns, rows }) => {
  return (
    <tbody>
      {rows.length > 0 ? (
        rows.map((row: Record<string, unknown>, rowIndex: number) => (
          <tr key={rowIndex} className='border-b border-gray-200 dark:border-dark-3'>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-3 text-sm ${column.className || ''}`}
                style={{ width: column.width }}
              >
                {column.render ? column.render(row[column.key], row, rowIndex) : String(row[column.key] || '')}
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
  )
}
