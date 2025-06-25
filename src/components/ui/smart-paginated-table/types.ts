import type { ReactNode } from 'react'

export interface SmartColumn {
  key: string
  header: string
  isSort?: boolean
  className?: string
  width?: string
  render?: (value: unknown, row: Record<string, unknown>, index: number) => ReactNode
}

export interface SmartTableMeta {
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export interface SmartTableResponse {
  data: Record<string, unknown>[]
  meta: SmartTableMeta
  [key: string]: unknown
}

export interface SmartPaginatedTableProps {
  path: string
  columns: SmartColumn[]
  initialQuery?: Record<string, unknown>
  sort?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  refetchOnWindowFocus?: boolean
}
