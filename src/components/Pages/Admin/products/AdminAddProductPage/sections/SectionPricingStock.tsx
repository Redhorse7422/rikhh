import React, { FC } from 'react'
import { Control, useFormContext } from 'react-hook-form'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'
import { TextField } from '@/components/FormElements/TextInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { NewProductForm } from '..'

const discountTypeOptions = [
  { value: 'percent', label: 'Percent' },
  { value: 'amount', label: 'Amount' },
]

type SectionPricingStockProps = {
  control: Control<NewProductForm>
}

export const SectionPricingStock: FC<SectionPricingStockProps> = ({ control }) => {
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Pricing & Stock</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField
          control={control}
          name='regularPrice'
          label='Regular Price'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
        <TextField
          control={control}
          name='salePrice'
          label='Sale Price'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
        <TextField
          control={control}
          name='discount'
          label='Discount'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
        <SelectField
          control={control}
          name='discountType'
          label='Discount Type'
          items={discountTypeOptions}
          placeholder='Select discount type'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <TextField
          control={control}
          name='discountStartDate'
          label='Discount Start Date'
          labelAxis='horizontal'
          labelWidth={180}
          type='datetime-local'
        />
        <TextField
          control={control}
          name='discountEndDate'
          label='Discount End Date'
          labelAxis='horizontal'
          labelWidth={180}
          type='datetime-local'
        />
        <TextField control={control} name='stock' label='Stock' labelAxis='horizontal' labelWidth={180} type='number' />
        <CheckboxField name='isVariant' label='Is Variant' control={control} labelWidth={180} labelAxis='horizontal' />
        <CheckboxField name='published' label='Published' control={control} labelWidth={180} labelAxis='horizontal' />
        <CheckboxField name='approved' label='Approved' control={control} labelWidth={180} labelAxis='horizontal' />
        <CheckboxField name='featured' label='Featured' control={control} labelWidth={180} labelAxis='horizontal' />
        <CheckboxField
          name='cashOnDelivery'
          label='Cash On Delivery'
          control={control}
          labelWidth={180}
          labelAxis='horizontal'
        />
      </Grid>
    </Card>
  )
}

export default SectionPricingStock
