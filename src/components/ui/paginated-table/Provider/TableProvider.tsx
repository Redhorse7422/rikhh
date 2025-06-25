'use client'

import type { TableContextType, TableProviderProps } from '../type'

import React, { useEffect, useMemo, useState } from 'react'

import { TableContext } from './TableContext'

export const TableProvider = ({ children, ...props }: TableProviderProps) => {
  const [columns, setColumns] = useState<TableContextType['columns']>([])
  const [filterOpts, setFilterOpts] = useState<TableContextType['filterOpts']>()
  const [sortOpts, setSortOpts] = useState<TableContextType['sortOpts']>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [search, setSearch] = useState<string>()
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sort, setSort] = useState<string>()
  const [filters, setFilters] = useState<object>()

  // Update total and call onTotalChange if provided
  const updateTotal = (newTotal: number) => {
    setTotal(newTotal)
    if (props.onTotalChange) {
      props.onTotalChange(newTotal)
    }
  }

  const value = useMemo(
    () => ({
      columns,
      filterOpts,
      sortOpts,
      search,
      setSearch,
      total,
      setTotal: updateTotal,
      filters,
      setFilters,
      sort,
      setSort,
      page,
      totalPages,
      setPage,
      setTotalPages,
      limit,
      setLimit,
      isLoading,
      setIsLoading,
      onTotalChange: props.onTotalChange,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      search,
      total,
      columns,
      filterOpts,
      sortOpts,
      filters,
      sort,
      page,
      totalPages,
      limit,
      isLoading,
      props.onTotalChange,
    ],
  )

  useEffect(() => setColumns(props?.columns || []), [props?.columns])
  useEffect(() => setFilterOpts(props?.filterOpts || []), [props?.filterOpts])
  useEffect(() => setSortOpts(props?.sortOpts || []), [props?.sortOpts])

  // Reset page to 1 when filters, search, or sort change
  useEffect(() => {
    setPage(1)
  }, [filters, search, sort])

  return <TableContext.Provider value={value}>{children(value)}</TableContext.Provider>
}
