export interface ApiResBodyBaseSuccessful<T> {
  code: 0
  message: string
  request_id: string
  data: T
}

export interface ApiResBodyBaseFailed {
  code: 1
  message: string
  request_id: string
}

export type ApiResBodyBase<TData> = ApiResBodyBaseSuccessful<TData> | ApiResBodyBaseFailed

export type ApiResBodyPaginated<TData = unknown> = ApiResBodyBase<{
  data: TData[]
  limit: number
  offset: number
  page: number
  total: number
  totalPage: number
  totally: number
}>
