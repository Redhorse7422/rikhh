'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from './SectionAction'
import { SectionCategoryDetail } from './SectionCategoryDetail'



export type NewCategoryForm = {
  isActive: boolean
  name: string
  slug: string
  parentId: string
  isFeatured: boolean
  description: string
  thumbnail: FileWithPreview[]
}

const defaultValues: NewCategoryForm = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
  thumbnail: [],
}

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

      const formData = new FormData()
      formData.append('name', data.name.trim())
      formData.append('slug', data.slug.trim())
      formData.append('isActive', String(data.isActive))

      if (data.parentId?.trim()) {
        formData.append('parentId', data.parentId.trim())
      }

      formData.append('isFeatured', String(data.isFeatured))
      formData.append('description', data.description.trim())

      // Append thumbnail file if available
      if (data.thumbnail.length > 0 && data.thumbnail[0].file) {
        formData.append('image', data.thumbnail[0].file)
      }

      await createDataSource.mutateAsync({
        path: '/v1/categories/store',
        body: formData,
      })

      showToast('Category created successfully!', 'success')
      router.push('/categories')
    } catch (error) {
      logger.error('Failed to create category:', error)
      showToast('Failed to create category. Please try again.', 'error')
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
