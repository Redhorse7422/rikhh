'use client'

import type { DesktopTableWithoutQsProps } from './type'

import { useContext } from 'react'

import { TableContext } from './Provider'
import { CustomTable } from './Table'
import { useQueryWithoutQs } from './useTableData'

export const TableWithQs = ({ path, initialQuery, transform, columns }: DesktopTableWithoutQsProps) => {
  const ctx = useContext(TableContext)
  const {
    dataSource,
    isLoading,
    total,
    totalPages,
    page = 1,
    sort,
    limit = 10,
    refetch,
  } = useQueryWithoutQs({
    path,
    initialQuery,
    currentQuery: {
      page: ctx.page,
      limit: ctx.limit,
      sort: ctx.sort,
      filters: ctx.filters,
    },
    transform,
  })

  return (
    <CustomTable
      columns={columns ?? []}
      dataSource={dataSource}
      total={total}
      limit={limit}
      page={page}
      totalPages={totalPages}
      isLoading={isLoading}
      sort={sort}
    />
  )
}
