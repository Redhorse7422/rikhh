import React, { FC } from 'react'
import { Control } from 'react-hook-form'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'
import { TextField } from '@/components/FormElements/TextInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { NewProductForm } from '..'

const taxTypeOptions = [
  { value: 'percent', label: 'Percent' },
  { value: 'amount', label: 'Amount' },
]
const shippingTypeOptions = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
]

type SectionTaxShippingProps = {
  control: Control<NewProductForm>
}

export const SectionTaxShipping: FC<SectionTaxShippingProps> = ({ control }) => {
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Tax & Shipping</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField control={control} name='tax' label='Tax' labelAxis='horizontal' labelWidth={180} type='number' />
        <SelectField
          control={control}
          name='taxType'
          label='Tax Type'
          items={taxTypeOptions}
          placeholder='Select tax type'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <SelectField
          control={control}
          name='shippingType'
          label='Shipping Type'
          items={shippingTypeOptions}
          placeholder='Select shipping type'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <TextField
          control={control}
          name='shippingCost'
          label='Shipping Cost'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
        <TextField
          control={control}
          name='estShippingDays'
          label='Estimated Shipping Days'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
      </Grid>
    </Card>
  )
}

export default SectionTaxShipping
