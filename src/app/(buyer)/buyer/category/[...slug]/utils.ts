import type { ApiResBodyBase } from '@/types/api'
import type { Category, Product } from '@/types/common'

import { server } from '@/libs/axios'
import { logger } from '@/libs/logger.server'

export const fetchCategoryDetailBySlug = async (catSlug: string) => {
  console.log('Calling backend for slug:', catSlug)
  return server<ApiResBodyBase<Category>>({
    method: 'get',
    url: `/v1/categories/slug/${catSlug}`,
  }).then((res) => {
    if (res.data.code === 0) {
      return res.data.data && res.data.data
    }

    logger.warn('Got non-zero response code from API', { data: res.data })

    return null
  })
}

export const fetchProductsByCategory = async (catId: string) => {
  console.log('Calling backend for slug:', catId)
  return server<ApiResBodyBase<Product>>({
    method: 'get',
    url: `/v1/products/category/${catId}`,
  }).then((res) => {
    if (res.data.code === 0) {
      return res
    }

    logger.warn('Got non-zero response code from API', { data: res.data })

    return null
  })
}
