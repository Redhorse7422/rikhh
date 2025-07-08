import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'


import { TextField } from '@/components/FormElements/TextInput'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'


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
