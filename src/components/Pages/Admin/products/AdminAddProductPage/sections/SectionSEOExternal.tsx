import React, { FC } from 'react'
import { Control } from 'react-hook-form'
import { Card } from '@/components/common/Card'
import { Grid } from '@/libs/pureTailwind'
import { TextField } from '@/components/FormElements/TextInput'
import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { NewProductForm } from '..'

type SectionSEOExternalProps = {
  control: Control<NewProductForm>
}

export const SectionSEOExternal: FC<SectionSEOExternalProps> = ({ control }) => {
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>SEO & External</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField control={control} name='metaTitle' label='SEO Meta Title' labelAxis='horizontal' labelWidth={160} />
        <TextAreaField
          control={control}
          name='metaDescription'
          label='SEO Meta Description'
          placeholder='SEO Meta Description for the product page'
        />
        <TextField
          control={control}
          name='rating'
          label='Rating'
          labelAxis='horizontal'
          labelWidth={180}
          type='number'
        />
        <TextField
          control={control}
          name='externalLink'
          label='External Link'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <TextField
          control={control}
          name='externalLinkBtn'
          label='External Link Button Text'
          labelAxis='horizontal'
          labelWidth={180}
        />
      </Grid>
    </Card>
  )
}

export default SectionSEOExternal
