/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import type { ApiFieldType, ApiGetByIdProps, ApiGetProps, ApiGetTemplateResponse, ApiGetWithApiHookProps } from './type'

import { useMutation, useQuery } from '@tanstack/react-query'

import { apiCreate, apiGet, apiGetById, apiGetFile, apiPatch, apiRemove, apiUpdate } from './axios'

type ApiGetPropsWithCriteriaOpts = ApiGetWithApiHookProps & {
  criteriaOpts?: { type?: ApiFieldType; name: string; options?: any[]; apiValue?: any }[]
}

const handleSort = (sort?: string) => {
  if (!sort) return { sort: undefined }
  if (sort.startsWith('-')) return { sort: `${sort.slice(1)}`, order: 'desc' }
  return { sort, order: 'asc' }
}

export const useApi = () => {
  const getDataSource = <T = ApiGetTemplateResponse>(props: ApiGetPropsWithCriteriaOpts) => {
    const { enabled = true } = props

    return useQuery<T>({
      queryKey: [`get-${props?.path}${props?.subPath}`, props?.query, props?.body],
      queryFn: () => {
        return apiGet({
          ...props,
          query: {
            ...props.query,
            whereJson: undefined,
            ...(props.query?.sort && handleSort(props.query.sort)),
            ...(props.query?.whereJson && {
              whereJson: `${encodeURIComponent(JSON.stringify(props.query.whereJson))}`,
            }),
          },
        })
      },
      enabled,
      refetchOnWindowFocus: props?.refetchOnWindowFocus,
    })
  }

  const getDataSourceById = <T = any>(props: ApiGetByIdProps) => {
    const { enabled = true } = props

    return useQuery<T>({
      queryKey: [`get-${props.path}`, props.id, props.query],
      queryFn: () => apiGetById({ ...props }),
      enabled: enabled && !!props?.id,
      refetchOnWindowFocus: props?.refetchOnWindowFocus,
    })
  }

  const createDataSource = useMutation({
    mutationFn: apiCreate,
  })

  const updateDataSource = useMutation({
    mutationFn: apiUpdate,
  })

  const patchDataSource = useMutation({
    mutationFn: apiPatch,
  })

  const removeDataSource = useMutation({
    mutationFn: apiRemove,
  })

  const getFile = <T = any>(props: Omit<ApiGetProps, 'method'>) => {
    const { enabled = true } = props

    return useQuery<T>({
      queryKey: [`get-${props?.path}${props?.subPath}`, props?.query, props?.body],
      queryFn: () => {
        return apiGetFile({
          ...props,
          query: {
            ...props.query,
            whereJson: undefined,
            ...(props.query?.sort && handleSort(props.query.sort)),
            // ...(props.query?.filters && handleFilters(props.query.filters, props?.criteriaOpts)),
            ...(props.query?.whereJson && {
              whereJson: `${encodeURIComponent(JSON.stringify(props.query.whereJson))}`,
            }),
          },
        })
      },
      enabled,
      refetchOnWindowFocus: props?.refetchOnWindowFocus,
    })
  }

  const getFileMutate = useMutation({
    mutationFn: apiGetFile,
  })

  const getMutateDataSource = useMutation({
    mutationFn: apiGet,
  })

  return {
    getDataSource,
    getDataSourceById,
    createDataSource,
    updateDataSource,
    patchDataSource,
    removeDataSource,
    getFile,
    getFileMutate,
    getMutateDataSource,
  }
}
