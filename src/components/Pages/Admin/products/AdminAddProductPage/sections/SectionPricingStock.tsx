import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { useFormContext, useWatch } from 'react-hook-form'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { SwitcherField } from '@/components/FormElements/Switchers'
import { TextField } from '@/components/FormElements/TextInput'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'

const discountTypeOptions = [
  { value: 'percent', label: 'Percent' },
  { value: 'amount', label: 'Amount' },
]

type SectionPricingStockProps = {
  control: Control<NewProductForm>
}

export const SectionPricingStock: FC<SectionPricingStockProps> = ({ control }) => {
  const { control: rhfControl } = useFormContext<NewProductForm>()
  const isVariant = useWatch({ control: rhfControl, name: 'isVariant' })
  const discountEnabled = useWatch({ control: rhfControl, name: 'discountEnabled' })

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
        {/* Discount Toggle */}
        <SwitcherField
          name='discountEnabled'
          control={control}
          label='Enable Discount'
          labelAxis='horizontal'
          labelWidth={180}
        />
        {/* Discount Fields (conditional) */}
        {discountEnabled && (
          <>
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
          </>
        )}
        <TextField control={control} name='stock' label='Stock' labelAxis='horizontal' labelWidth={180} type='number' />
        {/* isVariant Toggle */}
        <SwitcherField
          name='isVariant'
          control={control}
          label='Is Variant'
          labelAxis='horizontal'
          labelWidth={180}
        />
        {/* Variants Section (conditional) */}
        {isVariant && (
          <div className='col-span-full'>
            {/* Replace with actual variants section/component */}
            <div>Variants Section</div>
          </div>
        )}
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
