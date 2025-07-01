import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { RepeaterField, type RepeaterFieldConfig } from '@/components/FormElements/RepeaterField'
import { Card } from '@/components/common/Card'

type SectionVariationsProps = {
  control: Control<NewProductForm>
}

const variationFields: RepeaterFieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'select',
    required: true,
    options: [
      { value: 'size', label: 'Size' },
      { value: 'color', label: 'Color' },
      { value: 'style', label: 'Style' },
    ],
  },
  {
    name: 'variant',
    label: 'Variant Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Size M - Red',
  },
  {
    name: 'sku',
    label: 'SKU',
    type: 'text',
    required: true,
    placeholder: 'e.g., PROD-001-M-RED',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    required: true,
    placeholder: '0.00',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: true,
    placeholder: '0',
  },
  {
    name: 'imageBase64',
    label: 'Variant Image',
    type: 'file',
    accept: ['image/*'],
    multiple: false,
    maxCount: 1,
    uploadMode: 'upload',
    uploadUrl: '/api/v1/media/upload',
    uploadFieldName: 'file',
    valueField: 'fileId',
  },
]

export const SectionVariations: FC<SectionVariationsProps> = ({ control }) => {
  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Product Variations</h2>
      <p className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
        Add different variations of your product (e.g., different sizes, colors, etc.)
      </p>

      <RepeaterField
        control={control}
        name='variations'
        fields={variationFields}
        addButtonText='Add Variation'
        removeButtonText='Remove Variation'
        rules={{
          validate: (value: any) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
              return true // Allow empty variations
            }

            // Validate each variation
            for (let i = 0; i < value.length; i++) {
              const variation = value[i]

              if (!variation.variant || variation.variant.trim() === '') {
                return `Variation ${i + 1}: Variant name is required`
              }

              if (!variation.sku || variation.sku.trim() === '') {
                return `Variation ${i + 1}: SKU is required`
              }

              if (!variation.price || variation.price <= 0) {
                return `Variation ${i + 1}: Price must be greater than 0`
              }

              if (!variation.quantity || variation.quantity < 0) {
                return `Variation ${i + 1}: Quantity must be 0 or greater`
              }
            }

            return true
          },
        }}
      />
    </Card>
  )
}

export default SectionVariations
