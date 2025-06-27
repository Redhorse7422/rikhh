import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { TextField } from '@/components/FormElements/TextInput'
import { UploadField } from '@/components/FormElements/UploadInput'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'

type SectionMediaProps = {
  control: Control<NewProductForm>
}

export const SectionMedia: FC<SectionMediaProps> = ({ control }) => {
  return (
    <Card className='pt-10'>
      <h2 className='mb-4 text-2xl font-bold'>Media</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <UploadField
          control={control}
          name='thumbnailImg'
          dragBoxTitle='Product Thumbnail'
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          label='Thumbnail Image'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <UploadField
          control={control}
          name='photos'
          dragBoxTitle='Product Photos'
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          label='Product Photos'
          labelAxis='horizontal'
          labelWidth={180}
          multiple
        />
        <TextField
          control={control}
          name='variations'
          label='Variations (JSON or CSV)'
          labelAxis='horizontal'
          labelWidth={180}
        />
      </Grid>
    </Card>
  )
}

export default SectionMedia
