'use client'

import type { TableContextType } from '../type'

import { createContext } from 'react'

export const TableContext = createContext<TableContextType>({
  columns: [],
  setIsLoading: () => {},
  setSearch: () => {},
  setTotal: () => {},
  setFilters: () => {},
  setSort: () => {},
  setPage: () => {},
  setTotalPages: () => {},
  setLimit: () => {},
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 10,
})
