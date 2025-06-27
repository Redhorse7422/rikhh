import React, { FC } from 'react'
import { Control } from 'react-hook-form'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'
import { TextField } from '@/components/FormElements/TextInput'
import { NewProductForm } from '..'

type SectionStatsProps = {
  control: Control<NewProductForm>
}

export const SectionStats: FC<SectionStatsProps> = ({ control }) => {
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Stats</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField
          control={control}
          name='numOfSales'
          label='Number of Sales'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
      </Grid>
    </Card>
  )
}

export default SectionStats
