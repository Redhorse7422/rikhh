import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { MultiSelectField } from '@/components/FormElements/MultiSelectField'
import { TextField } from '@/components/FormElements/TextInput'
import { Card } from '@/components/common/Card'
import { useApi } from '@/hooks/useApi'
import { Grid } from '@/libs/pureTailwind'

type SectionBasicInfoProps = {
  control: Control<NewProductForm>
}

export const SectionBasicInfo: FC<SectionBasicInfoProps> = ({ control }) => {
  const { getDataSource } = useApi()
  const { data: categoriesOption } = getDataSource({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })
  const categoryOptions = Array.isArray(categoriesOption?.data)
    ? categoriesOption.data.map((cat: any) => ({ value: cat.id, label: cat.name }))
    : []
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Basic Information</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField
          control={control}
          name='name'
          label='Product Name'
          labelAxis='horizontal'
          labelWidth={180}
          rules={{ required: 'Name is required' }}
          maxLength={500}
        />
        <TextField control={control} name='slug' label='Slug' labelAxis='horizontal' labelWidth={180} maxLength={500} />
        <MultiSelectField
          label='Categories'
          items={categoryOptions}
          name='categoryIds'
          control={control}
          labelAxis='horizontal'
          labelWidth={180}
          // maxLength={500}
        />
        {/* <SelectField
          control={control}
          name='categoryId'
          label='Category'
          items={categoryOptions}
          placeholder='Select category'
          labelAxis='horizontal'
          labelWidth={180}
        /> */}
        <TextField
          control={control}
          name='tags'
          label='Tags (comma separated)'
          labelAxis='horizontal'
          labelWidth={180}
          maxLength={500}
        />
        <TextField
          control={control}
          name='shortDescription'
          label='Short Description'
          labelAxis='horizontal'
          labelWidth={180}
          maxLength={500}
        />
        <TextAreaField
          control={control}
          name='longDescription'
          label='Long Description'
          placeholder='Detailed product description with all features and benefits'
        />
      </Grid>
    </Card>
  )
}

export default SectionBasicInfo
