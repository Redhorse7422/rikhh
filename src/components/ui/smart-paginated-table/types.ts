export interface SmartColumn {
  header: string
  key: string
  width?: string
  isSort?: boolean
  render?: (value: any, row: any, index: number) => React.ReactNode
  className?: string
}

export interface SmartPaginatedTableProps {
  path: string
  columns: SmartColumn[]
  initialQuery?: Record<string, any>
  sort?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  refetchOnWindowFocus?: boolean
}

export interface SmartTableMeta {
  total: number
  totalPages: number
  [key: string]: any
}

export interface SmartTableResponse {
  data: any[]
  meta: SmartTableMeta
  [key: string]: any
} 