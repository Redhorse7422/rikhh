import React from 'react'
import { SmartColumn } from './types'

interface TableBodyProps {
  columns: SmartColumn[]
  rows: any[]
}

export const TableBody: React.FC<TableBodyProps> = ({ columns, rows }) => {
  return (
    <tbody>
      {rows.length > 0 ? (
        rows.map((row: any, rowIndex: number) => (
          <tr key={row.id || rowIndex} className='border-b transition-colors hover:bg-neutral-100/50 dark:hover:bg-dark-2'>
            {columns.map((col) => (
              <td key={col.key} className={`p-4 align-middle ${col.className || ''}`}>
                {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key] ?? '-'}
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