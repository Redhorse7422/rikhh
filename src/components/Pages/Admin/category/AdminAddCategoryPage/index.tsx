'use client'

import { useApi } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { SectionCategoryDetail } from './SectionCategoryDetail'
import { SectionAction } from './SectionAction'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'
import useToast from '@/hooks/useToast'

const defaultValues = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
}

export type NewCategoryForm = typeof defaultValues

export const AdminAddCategoryPage = () => {
  const { control, handleSubmit } = useForm<NewCategoryForm>({
    defaultValues,
  })

  const router = useRouter()
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const fullLoading = useFullScreenLoading()
  const handleOnSubmit = async (data: NewCategoryForm) => {
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
      showToast('Category Created successful!', 'success')
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
      <SectionAction />
    </form>
  )
}
