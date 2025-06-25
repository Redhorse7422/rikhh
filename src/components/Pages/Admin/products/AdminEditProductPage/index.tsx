'use client'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Loader } from '@/components/common/Loading/Loader'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from '../AdminAddProductPage/SectionAction'
import { SectionProductDetail } from '../AdminAddProductPage/SectionProductsDetail'


const defaultValues = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
}

export type NewProductForm = typeof defaultValues

export const AdminEditProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()

  const { getDataSourceById, updateDataSource } = useApi()
  const {
    data: productCategory,
    isLoading,
    status,
  } = getDataSourceById({
    path: '/v1/products',
    id,
    enabled: !!id,
  })

  const { control, handleSubmit, setValue } = useForm<NewProductForm>({
    defaultValues,
  })

  useEffect(() => {
    if (isLoading && status === 'pending' && !productCategory) {
      fullLoading.open()
    } else {
      fullLoading.close()
      if (productCategory && typeof productCategory === 'object') {
        setValue('name', (productCategory as any).name ?? '')
        setValue('slug', (productCategory as any).slug ?? '')
        setValue('parentId', (productCategory as any)?.parent?.id)
        setValue('isActive', (productCategory as any).isActive ?? false)
        setValue('isFeatured', (productCategory as any).isFeatured ?? false)
      }
    }
  }, [productCategory, isLoading, status])

  const handleOnSubmit = async (data: NewProductForm) => {
    try {
      fullLoading.open()
      await updateDataSource.mutateAsync({
        path: `/v1/products/update/${id}`,
        body: {
          name: data.name,
          slug: data.slug,
          isActive: data.isActive,
          ...(data.parentId !== '' && { parentId: data.parentId }),
          isFeatured: data.isFeatured,
        },
      })
      showToast('Product Updated successful!', 'success')
      router.push('/categories')
    } catch (error) {
      showToast('An error occurred!', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <form className='flex flex-col gap-y-6' onSubmit={handleSubmit(handleOnSubmit)}>
      <SectionProductDetail control={control} />
      <SectionAction updating />
    </form>
  )
}
