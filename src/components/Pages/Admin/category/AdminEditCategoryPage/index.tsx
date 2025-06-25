'use client'

import type { NewCategoryForm } from '../AdminAddCategoryPage'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from '../AdminAddCategoryPage/SectionAction'
import { SectionCategoryDetail } from '../AdminAddCategoryPage/SectionCategoryDetail'


const defaultValues = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
  thumbnail: [],
}

export const AdminEditCategoryPage = () => {
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
    path: '/v1/categories',
    id,
    enabled: !!id,
  })

  const { control, handleSubmit, setValue } = useForm<NewCategoryForm>({
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
        if ((productCategory as any).image) {
          setValue('thumbnail', [
            {
              id: 'existing',
              preview: (productCategory as any).image,
              name: (productCategory as any).name,
              size: 0,
              type: 'image/*',
              file: null as unknown as File, // Placeholder
            },
          ])
        }
      }
    }
  }, [productCategory, isLoading, status])

  const handleOnSubmit = async (data: NewCategoryForm) => {
    try {
      fullLoading.open()

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('slug', data.slug)
      formData.append('isActive', String(data.isActive))
      if (data.parentId?.trim()) {
        formData.append('parentId', data.parentId.trim())
      }
      formData.append('isFeatured', String(data.isFeatured))

      // ✅ Append thumbnail file if available
      if (data.thumbnail.length > 0 && data.thumbnail[0].file) {
        formData.append('image', data.thumbnail[0].file)
      }

      // await createOrderPayment(formData)

      await updateDataSource.mutateAsync({
        path: `/v1/categories/update/${id}`,
        body: formData,
      })
      showToast('Category Updated successful!', 'success')
      router.push('/categories')
    } catch (error) {
      showToast('An error occurred!', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <form className='flex flex-col gap-y-6' onSubmit={handleSubmit(handleOnSubmit)}>
      <SectionCategoryDetail control={control} />
      <SectionAction updating />
    </form>
  )
}
