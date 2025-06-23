import type { NewCategoryForm } from '.'
// import type { ProductCategory } from './mock'
// import type { OptionItem } from '@/types/option'
import type { Control } from 'react-hook-form'

import { type FC } from 'react'

import { useApi } from '@/hooks/useApi'
import { Grid } from '@/libs/pureTailwind'
import { Card } from '@/components/common/Card'
import { TextField } from '@/components/FormElements/Fields/TextField'
import { SelectField } from '@/components/FormElements/Fields/SelectField'
import { CheckboxField } from '@/components/FormElements/Fields/CheckboxField'
// import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'

type SectionCategoryDetailProps = {
  control: Control<NewCategoryForm>
  canEdit?: boolean | false
}

export const SectionCategoryDetail: FC<SectionCategoryDetailProps> = ({ control, canEdit }) => {
  // const productName = useController({ control, name: 'name' })
  const { getDataSource } = useApi()

  // const mapCategoryToOption = (category: ProductCategory): OptionItem => ({
  //   value: category.id,
  //   label: category.name,
  //   children: category.children
  //     ? category.children.map((child: ProductCategory) => mapCategoryToOption(child))
  //     : undefined,
  // })

  const { data: categoriesOption } = getDataSource({
    path: '/v1/categories',
  })

  const parentOptions = Array.isArray(categoriesOption?.data)
    ? categoriesOption.data.map((cat: any) => ({ value: cat.id, label: cat.name }))
    : []

  return (
    <Card>
      {/* <Text>New Category</Text> */}

      <Grid rowGap={4} className='max-w-3xl'>
        <CheckboxField
          control={control}
          name="isActive"
          label="Active"
        />
        <CheckboxField
          control={control}
          name="isFeatured"
          label="Featured"
        />
        <TextField
          control={control}
          name="name"
          rules={{ required: 'Name is Required' }}
          label="Name :"
          labelAxis="horizontal"
          labelWidth={160}
          maxLength={500}
        />
        <TextField
          control={control}
          name="slug"
          label="Slug :"
          labelAxis="horizontal"
          labelWidth={160}
          maxLength={500}
        />
        <SelectField
          control={control}
          name="parentId"
          label="Parent Category"
          items={parentOptions}
          placeholder="Select parent category"
        />
        {/* <TextAreaField
          control={control}
          name="description"
          label="Description"
          placeholder="Enter description"
        /> */}
      </Grid>
    </Card>
  )
}
