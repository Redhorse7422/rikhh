'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from './SectionAction'
import { SectionProductDetail } from './SectionProductsDetail'

const defaultValues = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
}

export type NewProductForm = typeof defaultValues

export const AdminAddProductPage = () => {
  const { control, handleSubmit } = useForm<NewProductForm>({
    defaultValues,
  })

  const router = useRouter()
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const fullLoading = useFullScreenLoading()
  const handleOnSubmit = async (data: NewProductForm) => {
    try {
      fullLoading.open()
      await createDataSource.mutateAsync({
        path: '/v1/categories/store',
        body: {
          name: data.name,
          slug: data.slug,
          isActive: data.isActive,
          parentId: data.parentId,
          isFeatured: data.isFeatured,
        },
      })
      showToast('Product Created successful!', 'success')
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
      <SectionAction />
    </form>
  )
}
