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
  query?: ApiQueryParamsProps
  enabled?: boolean
  subPath?: string
  lastPath?: string
  refetchOnWindowFocus?: boolean
  noCache?: boolean
}

export type ApiDefaultQueryWithApiHookProps = Omit<ApiDefaultQueryProps, 'query'> & {
  query?: Pick<ApiQueryParamsProps, 'filters' | 'sort' | 'fields' | 'limit' | 'page' | 'search'> & {
    whereJson?: Record<string, any>
  } & Record<string, any>
}

export type ApiCreateProps = {
  body?: any
} & Omit<ApiDefaultQueryProps, 'query'>

export type ApiGetProps = {
  method?: 'patch' | 'put' | 'delete' | 'post' | 'get'
  body?: any
  fileTypes?: ('pdf' | 'xlsx' | 'csv' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif')[]
} & ApiDefaultQueryProps

export type ApiGetWithApiHookProps = {
  method?: 'patch' | 'put' | 'delete' | 'post' | 'get'
  body?: any
} & ApiDefaultQueryWithApiHookProps

export type ApiGetByIdProps = {
  id?: string
} & ApiDefaultQueryProps

export type ApiRemoveProps = {
  id: string
  body?: any
} & Omit<ApiDefaultQueryProps, 'query' | 'refetchOnWindowFocus'>

export type ApiUpdateProps = {
  id?: string
  body?: any
} & Omit<ApiDefaultQueryProps, 'query' | 'refetchOnWindowFocus'>

export type ApiPatchProps = ApiUpdateProps

export type ApiGetTemplateResponse<T = any> = {
  data: T[]
  limit: number
  offset: number
  total: number
  page: number
  totally: number
  totalPage: number
} & {
  additionalData?: Record<string, any>
} & Record<string, any>

export type ApiFieldType = 'select' | 'multi-select' | 'date' | 'date-range' | 'text' | 'like'
