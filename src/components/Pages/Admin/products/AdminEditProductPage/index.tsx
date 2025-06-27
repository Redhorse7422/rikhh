'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'

import { Loader } from '@/components/common/Loading/Loader'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from '../AdminAddProductPage/sections/SectionAction'
import SectionBasicInfo from '../AdminAddProductPage/sections/SectionBasicInfo'
import SectionMedia from '../AdminAddProductPage/sections/SectionMedia'
import SectionPricingStock from '../AdminAddProductPage/sections/SectionPricingStock'
import SectionSEOExternal from '../AdminAddProductPage/sections/SectionSEOExternal'
import SectionStats from '../AdminAddProductPage/sections/SectionStats'
import SectionTaxShipping from '../AdminAddProductPage/sections/SectionTaxShipping'
import SectionVariations from '../AdminAddProductPage/sections/SectionVariations'

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
  id?: string
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

export const AdminEditProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()
  const { getDataSourceById, updateDataSource } = useApi()

  const {
    data: product,
    isLoading,
    status,
  } = getDataSourceById({
    path: '/v1/products',
    id,
    enabled: !!id,
  })

  const methods = useForm<NewProductForm>({
    defaultValues,
  })

  const { setValue } = methods

  useEffect(() => {
    if (isLoading && status === 'pending' && !product) {
      fullLoading.open()
    } else {
      fullLoading.close()
      if (product && typeof product === 'object') {
        // Set basic info
        setValue('name', (product as any).name ?? '')
        setValue('slug', (product as any).slug ?? '')
        setValue('categoryIds', (product as any).categoryIds ?? [])
        setValue('tags', (product as any).tags ?? '')
        setValue('shortDescription', (product as any).shortDescription ?? '')
        setValue('longDescription', (product as any).longDescription ?? '')

        // Set pricing and stock
        setValue('regularPrice', (product as any).regularPrice ?? 0)
        setValue('salePrice', (product as any).salePrice ?? 0)
        setValue('stock', (product as any).stock ?? 0)
        setValue('isVariant', (product as any).isVariant ?? false)
        setValue('published', (product as any).published ?? false)
        setValue('approved', (product as any).approved ?? false)
        setValue('cashOnDelivery', (product as any).cashOnDelivery ?? false)
        setValue('featured', (product as any).featured ?? false)

        // Set discount info
        setValue('discount', (product as any).discount ?? 0)
        setValue('discountType', (product as any).discountType ?? 'percent')
        setValue('discountStartDate', (product as any).discountStartDate ?? '')
        setValue('discountEndDate', (product as any).discountEndDate ?? '')

        // Set tax and shipping
        setValue('tax', (product as any).tax ?? 0)
        setValue('taxType', (product as any).taxType ?? 'percent')
        setValue('shippingType', (product as any).shippingType ?? 'free')
        setValue('shippingCost', (product as any).shippingCost ?? 0)
        setValue('estShippingDays', (product as any).estShippingDays ?? 0)

        // Set stats
        setValue('numOfSales', (product as any).numOfSales ?? 0)
        setValue('rating', (product as any).rating ?? 0)

        // Set SEO and external
        setValue('metaTitle', (product as any).metaTitle ?? '')
        setValue('metaDescription', (product as any).metaDescription ?? '')
        setValue('externalLink', (product as any).externalLink ?? '')
        setValue('externalLinkBtn', (product as any).externalLinkBtn ?? '')

        // Set images
        if ((product as any).thumbnailImg) {
          setValue('thumbnailImg', [
            {
              id: 'existing',
              preview: (product as any).thumbnailImg,
              name: 'thumbnail',
              size: 0,
              type: 'image/*',
              file: null as unknown as File,
            },
          ])
        }

        if ((product as any).photos && Array.isArray((product as any).photos)) {
          const photoFiles: FileWithPreview[] = (product as any).photos.map((photo: string, index: number) => ({
            id: `existing-${index}`,
            preview: photo,
            name: `photo-${index}`,
            size: 0,
            type: 'image/*',
            file: null as unknown as File,
          }))
          setValue('photos', photoFiles)
        }

        // Set variations
        if ((product as any).variations && Array.isArray((product as any).variations)) {
          console.log('Loading variations:', (product as any).variations)
          const variationFiles: ProductVariation[] = (product as any).variations.map(
            (variation: any, index: number) => ({
              id: variation.id || `existing-variation-${index}`,
              variant: variation.variant || '',
              sku: variation.sku || '',
              price: variation.price || 0,
              quantity: variation.quantity || 0,
              imageBase64: variation.image
                ? [
                    {
                      id: `existing-variation-image-${index}`,
                      preview: variation.image,
                      name: `variation-${index}`,
                      size: 0,
                      type: 'image/*',
                      file: null as unknown as File,
                    },
                  ]
                : [],
            }),
          )
          console.log('Processed variations:', variationFiles)
          setValue('variations', variationFiles)
          console.log('Variations set in form')
        } else {
          console.log('No variations found in product data')
          setValue('variations', [])
        }
      }
    }
  }, [product, isLoading, status, setValue])

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
                id: variation.id, // Include ID for existing variations
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

      await updateDataSource.mutateAsync({
        path: `/v1/products/update/${id}`,
        body: formData,
      })
      showToast('Product Updated successful!', 'success')
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
        <SectionAction updating />
      </form>
    </FormProvider>
  )
}

export default AdminEditProductPage
