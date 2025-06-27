'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput'

import React from 'react'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from './sections/SectionAction'
import SectionBasicInfo from './sections/SectionBasicInfo'
import SectionMedia from './sections/SectionMedia'
import SectionPricingStock from './sections/SectionPricingStock'
import SectionSEOExternal from './sections/SectionSEOExternal'
import SectionStats from './sections/SectionStats'
import SectionTaxShipping from './sections/SectionTaxShipping'
import SectionVariations from './sections/SectionVariations'

const defaultValues: NewProductForm = {
  name: '',
  slug: '',
  categoryIds: [],
  tags: '',
  shortDescription: '',
  longDescription: '',
  regularPrice: 0,
  salePrice: 0,
  isVariant: false,
  published: false,
  approved: false,
  stock: 0,
  cashOnDelivery: false,
  featured: false,
  discount: 0,
  discountType: 'percent',
  discountStartDate: '',
  discountEndDate: '',
  tax: 0,
  taxType: 'percent',
  shippingType: 'free',
  shippingCost: 0,
  estShippingDays: 0,
  numOfSales: 0,
  metaTitle: '',
  metaDescription: '',
  rating: 0,
  externalLink: '',
  externalLinkBtn: '',
  thumbnailImg: [],
  photos: [],
  variations: [],
}

export type ProductVariation = {
  variant: string
  sku: string
  price: number
  quantity: number
  imageBase64: FileWithPreview[]
}

export type NewProductForm = {
  name: string
  slug: string
  categoryIds: string[]
  tags: string
  shortDescription: string
  longDescription: string
  regularPrice: number
  salePrice: number
  isVariant: boolean
  published: boolean
  approved: boolean
  stock: number
  cashOnDelivery: boolean
  featured: boolean
  discount: number
  discountType: 'percent' | 'amount'
  discountStartDate: string
  discountEndDate: string
  tax: number
  taxType: 'percent' | 'amount'
  shippingType: 'free' | 'paid'
  shippingCost: number
  estShippingDays: number
  numOfSales: number
  metaTitle: string
  metaDescription: string
  rating: number
  externalLink: string
  externalLinkBtn: string
  thumbnailImg: FileWithPreview[]
  photos: FileWithPreview[]
  variations: ProductVariation[]
}

export const AdminAddProductPage: React.FC = () => {
  const methods = useForm<NewProductForm>({
    defaultValues,
  })

  const router = useRouter()
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const fullLoading = useFullScreenLoading()

  const handleOnSubmit = async (data: NewProductForm) => {
    try {
      fullLoading.open()

      // Validate variations before submission
      if (data.variations && Array.isArray(data.variations) && data.variations.length > 0) {
        for (let i = 0; i < data.variations.length; i++) {
          const variation = data.variations[i]

          if (!variation.variant || variation.variant.trim() === '') {
            showToast(`Variation ${i + 1}: Variant name is required`, 'error')
            fullLoading.close()
            return
          }

          if (!variation.sku || variation.sku.trim() === '') {
            showToast(`Variation ${i + 1}: SKU is required`, 'error')
            fullLoading.close()
            return
          }

          if (!variation.price || variation.price <= 0) {
            showToast(`Variation ${i + 1}: Price must be greater than 0`, 'error')
            fullLoading.close()
            return
          }

          if (variation.quantity === undefined || variation.quantity < 0) {
            showToast(`Variation ${i + 1}: Quantity must be 0 or greater`, 'error')
            fullLoading.close()
            return
          }
        }
      }

      // Convert form data to FormData for file uploads
      const formData = new FormData()
      console.log('Data ==> ', data.variations)

      // Add all fields to FormData
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof NewProductForm]
        if (key === 'thumbnailImg') {
          // Handle single thumbnail image
          const thumbnailArray = value as FileWithPreview[]
          if (Array.isArray(thumbnailArray) && thumbnailArray.length > 0) {
            formData.append(key, thumbnailArray[0].file)
          }
        } else if (key === 'photos') {
          // Handle photos array
          const photosArray = value as FileWithPreview[]
          if (Array.isArray(photosArray) && photosArray.length > 0) {
            photosArray.forEach((fileWithPreview, index) => {
              formData.append(`${key}[${index}]`, fileWithPreview.file)
            })
          }
        } else if (key === 'categoryIds') {
          // Handle categoryIds array
          const categoryIdsArray = value as string[]
          if (Array.isArray(categoryIdsArray) && categoryIdsArray.length > 0) {
            categoryIdsArray.forEach((categoryId, index) => {
              formData.append(`${key}[${index}]`, categoryId)
            })
          }
        } else if (key === 'variations') {
          // Handle variations array - send as JSON with file references
          const variationsArray = value as ProductVariation[]
          if (Array.isArray(variationsArray) && variationsArray.length > 0) {
            // Process variations to separate files from data
            const variationsData = variationsArray.map((variation, index) => {
              // Add variation image files to FormData with indexed keys
              if (Array.isArray(variation.imageBase64) && variation.imageBase64.length > 0) {
                formData.append(`variation_images[${index}]`, variation.imageBase64[0].file)
              }
              
              // Return variation data without the file (just metadata)
              return {
                variant: variation.variant,
                sku: variation.sku,
                price: variation.price,
                quantity: variation.quantity,
                // Don't include imageBase64 in the JSON, files are sent separately
              }
            })
            
            // Add the variations data as JSON
            formData.append(key, JSON.stringify(variationsData))
          }
        } else {
          // Handle other fields
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, String(value))
          }
        }
      })

      console.log('final Variations ==> ', formData.get('variations'))

      await createDataSource.mutateAsync({
        path: '/v1/products/store',
        body: formData,
      })
      showToast('Product Created successful!', 'success')
      router.push('/products')
    } catch (error) {
      showToast('An error occurred!', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col gap-y-6' onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <SectionBasicInfo control={methods.control} />
        <SectionPricingStock control={methods.control} />
        <SectionTaxShipping control={methods.control} />
        <SectionMedia control={methods.control} />
        <SectionVariations control={methods.control} />
        <SectionSEOExternal control={methods.control} />
        <SectionStats control={methods.control} />
        <SectionAction />
      </form>
    </FormProvider>
  )
}

export default AdminAddProductPage
