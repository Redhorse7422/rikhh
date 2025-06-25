/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiQueryParamsProps = {
  filters?: any
  sort?: string
  fields?: string[]
  limit?: number
  page?: number
  search?: string
  whereJson?: string
} & Record<string, any>

export type ApiDefaultQueryProps = {
  path: string
  subPath?: string
  query?: {
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    filters?: Record<string, unknown>
    whereJson?: string
    [key: string]: unknown
  }
  enabled?: boolean
  refetchOnWindowFocus?: boolean
}

export type ApiDefaultQueryWithApiHookProps = Omit<ApiDefaultQueryProps, 'query'> & {
  query?: Pick<ApiQueryParamsProps, 'filters' | 'sort' | 'fields' | 'limit' | 'page' | 'search'> & {
    whereJson?: Record<string, any>
  } & Record<string, any>
}

export type ApiCreateProps = {
  body?: Record<string, unknown> | FormData
} & Omit<ApiDefaultQueryProps, 'query'>

export type ApiGetProps = {
  method?: 'patch' | 'put' | 'delete' | 'post' | 'get'
  body?: Record<string, unknown> | FormData
  fileTypes?: ('pdf' | 'xlsx' | 'csv' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif')[]
} & ApiDefaultQueryProps

export type ApiGetWithApiHookProps = ApiGetProps & {
  criteriaOpts?: { type?: ApiFieldType; name: string; options?: unknown[]; apiValue?: unknown }[]
}

export type ApiGetByIdProps = {
  path: string
  id: string
  query?: Record<string, unknown>
  enabled?: boolean
  refetchOnWindowFocus?: boolean
}

export type ApiRemoveProps = {
  id: string
} & Omit<ApiDefaultQueryProps, 'query'>

export type ApiUpdateProps = {
  body?: Record<string, unknown> | FormData
} & Omit<ApiDefaultQueryProps, 'query'>

export type ApiPatchProps = {
  body?: Record<string, unknown> | FormData
} & Omit<ApiDefaultQueryProps, 'query'>

export type ApiGetTemplateResponse<T = Record<string, unknown>> = {
  data: T[]
  limit: number
  offset: number
  total: number
  page: number
  totally: number
  totalPage: number
} & {
  additionalData?: Record<string, unknown>
} & Record<string, unknown>

export type ApiFieldType = 'select' | 'multi-select' | 'date' | 'date-range' | 'text' | 'like'
