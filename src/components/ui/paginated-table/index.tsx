'use client'

import type { TableProps } from './type'
import { TableProvider } from './Provider'
import { TableWithQs } from './TableQuery'

export const PaginatedTable = (props: TableProps) => {
  const { path, columns, filterOpts, sortOpts, initialQuery, onTotalChange } = props

  return (
    <TableProvider columns={columns} filterOpts={filterOpts} sortOpts={sortOpts} onTotalChange={onTotalChange}>
      {(value) => (
        <div className='flex flex-col gap-4'>
          <TableWithQs path={path} initialQuery={initialQuery} columns={columns} />
        </div>
      )}
    </TableProvider>
  )
}
