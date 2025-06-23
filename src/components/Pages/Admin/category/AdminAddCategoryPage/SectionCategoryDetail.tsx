import type { NewCategoryForm } from '.'
import type { Control } from 'react-hook-form'

import { type FC } from 'react'

import { useApi } from '@/hooks/useApi'
import { Grid } from '@/libs/pureTailwind'
import { Card } from '@/components/common/Card'
import { TextField } from '@/components/FormElements/TextInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { CheckboxField } from '@/components/FormElements/CheckboxInput'

type SectionCategoryDetailProps = {
  control: Control<NewCategoryForm>
  canEdit?: boolean | false
}

export const SectionCategoryDetail: FC<SectionCategoryDetailProps> = ({ control, canEdit }) => {
  const { getDataSource } = useApi()

  const { data: categoriesOption } = getDataSource({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })

  const parentOptions = Array.isArray(categoriesOption?.data)
    ? categoriesOption.data.map((cat: any) => ({ value: cat.id, label: cat.name }))
    : []

  return (
    <Card className='pt-10'>
      <Grid rowGap={4} className='max-w-3xl'>
        <TextField
          control={control}
          name='name'
          rules={{ required: 'Name is Required' }}
          label='Name :'
          labelAxis='horizontal'
          labelWidth={160}
          maxLength={500}
        />
        <TextField
          control={control}
          name='slug'
          label='Slug :'
          labelAxis='horizontal'
          labelWidth={160}
          maxLength={500}
          // rules={{ required: 'Slug is Required' }}
        />
        <SelectField
          control={control}
          name='parentId'
          label='Parent Category'
          items={parentOptions}
          placeholder='Select parent category'
          // rules={{ required: 'Parent is Required' }}
          labelAxis='horizontal'
          labelWidth={160}
        />
        <CheckboxField name='isActive' label='isActive' control={control} labelWidth={160} labelAxis='horizontal' />
        <CheckboxField name='isFeatured' label='isFeatured' control={control} labelWidth={160} labelAxis='horizontal' />
      </Grid>
    </Card>
  )
}
