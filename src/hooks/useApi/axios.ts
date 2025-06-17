/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ApiCreateProps,
  ApiGetProps,
  ApiGetByIdProps,
  ApiPatchProps,
  ApiRemoveProps,
  ApiUpdateProps,
} from './type'

import { client } from '../../libs/axios'

const getPath = (props: { path?: string; subPath?: string; id?: string; lastPath?: string }) => {
  let path = props?.path || '/'

  if (props?.subPath) path += `/${props.subPath}`

  if (props?.id) path += `/${props.id}`

  if (props?.lastPath) path += `/${props.lastPath}`

  return path.replaceAll('//', '/')
}

export const apiCreate = async (props: ApiCreateProps): Promise<any> => {
  return client.post(getPath(props), props.body, {
    ...(props?.body && props.body instanceof FormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
  })
}

export const apiGet = async (props: ApiGetProps): Promise<any> => {
  const method = props?.method || 'get'
  const query = method === 'get' ? { params: props?.query } : props?.body

  return client[method](getPath(props), query)
}

export const apiGetById = async (props: ApiGetByIdProps): Promise<any> => {
  return client.get(getPath(props), { params: props?.query })
}

export const apiRemove = async (props: ApiRemoveProps): Promise<any> => {
  return client.delete(getPath(props))
}

// export const apiUpdate = async (props: ApiUpdateProps): Promise<any> => {
//   return client.put(getPath(props), props.body, {
//     ...(props?.body && props.body instanceof FormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
//   })
// }

export const apiUpdate = async (props: ApiUpdateProps): Promise<any> => {
  return client.put(getPath(props), props.body, {
    headers: {
      'Content-Type': props?.body instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  })
}

export const apiPatch = async (props: ApiPatchProps): Promise<any> => {
  return client.patch(getPath(props), props.body, {
    ...(props?.body && props.body instanceof FormData && { headers: { 'Content-Type': 'multipart/form-data' } }),
  })
}

export const apiGetFile = async (props: Omit<ApiGetProps, 'method'>): Promise<any> => {
  const accepts = props?.fileTypes
    ?.map((type) => {
      if (type === 'pdf') return 'application/pdf'
      if (type === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (type === 'csv') return 'text/csv'
      if (type === 'png') return 'image/png'
      if (type === 'jpg') return 'image/jpg'
      if (type === 'jpeg') return 'image/jpeg'
      if (type === 'webp') return 'image/webp'
      if (type === 'gif') return 'image/gif'
      return type
    })
    .join(',')

  return client.get(getPath(props), {
    params: props?.query,
    ...(props?.fileTypes && {
      responseType: 'arraybuffer',
      headers: { Accept: accepts, 'Content-Type': accepts, 'X-download-file': 'true' },
    }),
  })
}
