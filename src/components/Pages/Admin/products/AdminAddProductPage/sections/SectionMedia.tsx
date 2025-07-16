import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { TextField } from '@/components/FormElements/TextInput'
import { EnhancedUploadField } from '@/components/FormElements/UploadInput'
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
        <EnhancedUploadField
          uploadMode='upload'
          control={control}
          name='thumbnailImg'
          uploadUrl='/api/v1/media/upload'
          uploadFieldName='file'
          valueField='full'
          dragBoxTitle='Product Thumbnail'
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          label='Thumbnail Image'
          labelAxis='horizontal'
          labelWidth={180}
          rules={{
            required: 'Thumbnail is required',
          }}
        />
        <EnhancedUploadField
          uploadMode='upload'
          control={control}
          name='photos'
          uploadUrl='/api/v1/media/upload'
          uploadFieldName='file'
          valueField='full'
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
