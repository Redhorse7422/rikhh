import type { UseQueryWithoutQsProps } from './type'

import { useEffect, useState } from 'react'

import { useApi } from '@/hooks/useApi'
import { useNavigate } from '@/hooks/useNavigate'
import { TableContext } from './Provider'
// import { jsonToQueryString } from '@/utils/queryString'

export const useQueryWithoutQs = (props: UseQueryWithoutQsProps) => {
  const { path, initialQuery, currentQuery, resetPageOnFirstLoad, transform } = props
  const { navigate } = useNavigate()
  const [isFirstLoaded, setIsFirstLoaded] = useState(true)

  // eslint-disable-next-line no-underscore-dangle
  const _isFirstLoaded = resetPageOnFirstLoad && isFirstLoaded

  const page = _isFirstLoaded ? 1 : Number(currentQuery?.page || 1)
  const limit = Number(currentQuery?.limit) || 10
  const sort = currentQuery?.sort

  const { getDataSource } = useApi()

  const { data, isLoading, isFetching, refetch, isFetched } = getDataSource({
    path,
    query: {
      limit: 10,
      page: 1,
      ...(initialQuery as object),
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sort && { sort }),
    },
    enabled: !!path || (_isFirstLoaded && Number(currentQuery?.page) === 1),
  })

  useEffect(() => {
    if (_isFirstLoaded) navigate({ page: 1 })

    if (isFetched) setIsFirstLoaded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched])

  let dataSource: any[] = data?.data || []

  if (typeof transform === 'function') {
    dataSource = dataSource.map(transform)
  }

  return {
    dataSource,
    total: data?.meta?.total || 0,
    isLoading,
    isFetching,
    refetch,
    page: data?.meta?.page || 1,
    limit,
    totalPages: data?.meta?.totalPages || 1,
    sort,
  }
}
