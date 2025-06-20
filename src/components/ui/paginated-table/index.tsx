'use client'

import type { TableContextType, TableProps } from './type'
import { TableProvider } from './Provider'
import { TableWithQs } from './TableQuery'

export const PaginatedTable = (props: TableProps) => {
  console.log('Props ==> ', props)
  const { path, columns, filterOpts, sortOpts, initialQuery, onTotalChange } = props
  console.log('INital In Maina ==> ', initialQuery)
  const renderTable = (value: TableContextType) => {
    return <TableWithQs path={path} initialQuery={initialQuery} columns={columns} />
  }

  return (
    <TableProvider columns={columns} filterOpts={filterOpts} sortOpts={sortOpts} onTotalChange={onTotalChange}>
      {(value) => {
        return <div className='flex flex-col gap-4'>{renderTable(value)}</div>
      }}
    </TableProvider>
  )
}
