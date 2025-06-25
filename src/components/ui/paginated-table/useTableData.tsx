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
  const filters = currentQuery?.filters
  const search = 'search' in (currentQuery || {}) ? (currentQuery as any).search : undefined

  const { getDataSource } = useApi()

  // Always create a new query object with all dependencies
  const query = {
    ...(initialQuery as object),
    page,
    limit,
    ...(sort && { sort }),
    ...(filters && { filters }),
    ...(search && { search }),
  }

  const { data, isLoading, isFetching, refetch, isFetched } = getDataSource({
    path,
    query,
    enabled: !!path || (_isFirstLoaded && Number(currentQuery?.page) === 1),
  })

  useEffect(() => {
    if (_isFirstLoaded) navigate({ page: 1 })

    if (isFetched) setIsFirstLoaded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched])

  // Refetch data when page changes (especially when reset to 1)
  useEffect(() => {
    if (!isFirstLoaded) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  let dataSource: any[] = data?.data || []

  if (typeof transform === 'function') {
    dataSource = dataSource.map(transform)
  }

  return {
    dataSource,
    total: (data as any)?.meta?.total || 0,
    isLoading,
    isFetching,
    refetch,
    page: (data as any)?.meta?.page || 1,
    limit,
    totalPages: (data as any)?.meta?.totalPages || 1,
    sort,
  }
}
