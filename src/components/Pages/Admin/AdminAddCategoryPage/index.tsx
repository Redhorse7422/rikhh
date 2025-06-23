'use client'

import { useApi } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { SectionCategoryDetail } from './SectionCategoryDetail'
import { SectionAction } from './SectionAction'

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
  const { createDataSource } = useApi()

  const handleOnSubmit = async (data: NewCategoryForm) => {
    try {
      await createDataSource.mutateAsync({
        path: '/v1/category',
        body: {},
      })

      router.push('/categories')
    } catch (error) {}
  }

  return (
    <form className='flex flex-col gap-y-6' onSubmit={handleSubmit(handleOnSubmit)}>
      <SectionCategoryDetail control={control} />
      <SectionAction />
    </form>
  )
}
