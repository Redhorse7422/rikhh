import type { NewCategoryForm } from '.'
import type { useFormContext } from 'react-hook-form'

import type { FC } from 'react'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { UploadField } from '@/components/FormElements/UploadInput'
import { Card } from '@/components/common/Card'
import { useApi } from '@/hooks/useApi'
import { Grid } from '@/libs/pureTailwind'

interface CategoryOption {
  id: string
  name: string
}

interface SectionCategoryDetailProps {
  control: ReturnType<typeof useFormContext<NewCategoryForm>>['control']
  canEdit?: boolean
}

export const SectionCategoryDetail: FC<SectionCategoryDetailProps> = ({ control, canEdit }) => {
  const { getDataSource } = useApi()

  const { data: categoriesOption } = getDataSource<{ data: CategoryOption[] }>({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })

  const parentOptions = Array.isArray(categoriesOption?.data)
    ? categoriesOption.data.map((cat: CategoryOption) => ({ value: cat.id, label: cat.name }))
    : []

  return (
    <Card className='pt-10'>
      <Grid rowGap={4} className='max-w-3xl'>
        <UploadField
          control={control}
          name='thumbnail'
          dragBoxTitle='Category Thumbnail'
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          labelAxis='horizontal'
          labelWidth={160}
          label='Thumbnail'
          rules={{
            required: 'Thumbnail is required',
          }}
        />
        <TextField
          control={control}
          name='name'
          rules={{ required: 'Name is required' }}
          label='Name'
          labelAxis='horizontal'
          labelWidth={160}
          maxLength={500}
        />
        <TextField control={control} name='slug' label='Slug' labelAxis='horizontal' labelWidth={160} maxLength={500} />
        <SelectField
          control={control}
          name='parentId'
          label='Parent Category'
          items={parentOptions}
          placeholder='Select parent category'
          labelAxis='horizontal'
          labelWidth={160}
        />
        <CheckboxField name='isActive' label='Active' control={control} labelWidth={160} labelAxis='horizontal' />
        <CheckboxField name='isFeatured' label='Featured' control={control} labelWidth={160} labelAxis='horizontal' />
      </Grid>
    </Card>
  )
}
