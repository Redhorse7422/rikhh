/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
export type UseQueryWithQsProps = {
  path: string
  columns: ColumnOptions[]
  resetPageOnFirstLoad?: boolean
  initialQuery?: {
    fields?: string[]
    page?: number
    limit?: number
    sort?: string
    filters?: object
  } & Record<string, any>
  transform?: (v: any) => any
}

export type UseQueryWithoutQsProps = Pick<
  UseQueryWithQsProps,
  'path' | 'resetPageOnFirstLoad' | 'initialQuery' | 'transform'
> & {
  currentQuery: {
    page?: number
    totalPages?: number
    limit?: number
    sort?: string
    filters?: object
  }
}

export type ColumnOptions = {
  header?: string
  label?: string
  prefix?: string
  key?: string
  keyReserve?: string
  height?: string
  width?: string
  minWidth?: string
  isSort?: boolean
  sorter?: boolean | ((a: any, b: any) => number)
  sortKey?: string // NOTE: if sortKey is different from key
  className?: string
  defaultValue?: any
  fixedLine?: 1 | 2 | 3 | 4 | 5
  url?: string
  render?: (value: any, item: any, index: number, t: (txt: string) => string) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export type TabOptionList = {
  label: string
  value: any // NOTE: possible constant value "_ALL_" | "_EMPTY_" | "_NOT_EMPTY_"
}

export type TableContextType = {
  columns: ColumnOptions[]
  filterOpts?: any
  sortOpts?: {
    label: string
    value: string
  }[]

  isLoading?: boolean
  isFetching?: boolean
  search?: string
  page: number
  total: number
  totalPages: number
  limit: number
  filters?: object
  sort?: string

  // Actions
  setIsLoading: (value?: boolean) => void
  setSearch: (value?: string) => void
  setPage: (value: number) => void
  setTotal: (value: number) => void
  setTotalPages: (value: number) => void
  setLimit: (value: number) => void
  setFilters: (value?: object) => void
  setSort: (value?: string) => void
  onTotalChange?: (total: number) => void
}

export type TableProviderProps = {
  children: (props: TableContextType) => React.ReactNode
} & Pick<TableContextType, 'columns' | 'filterOpts' | 'sortOpts'> & {
    onTotalChange?: (total: number) => void
  }

export type DesktopTableProps = {
  refetch?: () => void
  dataSource: any[]
  columns: ColumnOptions[]
  isLoading: boolean
  total: number
  page: number
  totalPages: number
  search?: string
  filters?: object
  sort?: string
  limit: number
}

export type DesktopTableWithQsProps = Pick<UseQueryWithQsProps, 'path' | 'initialQuery' | 'transform'> &
  Partial<Pick<DesktopTableProps, 'dataSource' | 'columns'>>
export type DesktopTableWithoutQsProps = DesktopTableWithQsProps
export type DesktopTableExternalDataProps = Omit<DesktopTableWithQsProps, 'path'>

export type TableProps = Pick<DesktopTableWithQsProps, 'initialQuery' | 'dataSource' | 'transform' | 'path'> &
  Pick<TableProviderProps, 'columns' | 'filterOpts' | 'sortOpts'> & {
    onTotalChange?: (total: number) => void
  }
