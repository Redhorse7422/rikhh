'use client'

import type { CreateCouponData } from '@/types/coupon'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { MultiSelectField } from '@/components/FormElements/MultiSelectField'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { Grid, GridItem } from '@/libs/pureTailwind'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'
import { CouponType } from '@/types/coupon'

const defaultValues: CreateCouponData = {
  code: '',
  type: CouponType.PERCENTAGE,
  value: 0,
  isActive: true,
  startDate: '',
  endDate: '',
  usageLimit: undefined,
  minimumAmount: undefined,
  maximumDiscount: undefined,
  description: '',
  applicableProducts: [],
  applicableCategories: [],
}

export const AdminAddCouponPage = () => {
  const router = useRouter()
  const { createDataSource, getDataSource } = useApi()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()

  const { control, handleSubmit, watch } = useForm<CreateCouponData>({
    defaultValues,
  })

  const watchedType = watch('type')

  // Fetch categories and products for selection
  const { data: categoriesData } = getDataSource({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })
  const categoryOptions = Array.isArray(categoriesData?.data)
    ? categoriesData.data.map((cat: any) => ({ value: cat.id, label: cat.name }))
    : []

  const { data: productsData } = getDataSource({
    path: '/v1/products/all',
    query: { limit: 200 },
  })
  const productOptions = Array.isArray(productsData?.data)
    ? productsData.data.map((product: any) => ({ value: product.id, label: product.name }))
    : []

  const onSubmit = async (data: CreateCouponData) => {
    try {
      fullLoading.open()
      // Clean up data before sending
      const cleanedData = {
        ...data,
        name: data.code,
        usageLimit: data.usageLimit || undefined,
        minimumAmount: data.minimumAmount || undefined,
        maximumDiscount: data.maximumDiscount || undefined,
        description: data.description || undefined,
        applicableProducts: data.applicableProducts || [],
        applicableCategories: data.applicableCategories || [],
      }

      await createDataSource.mutateAsync({
        path: '/v1/coupons',
        body: cleanedData as unknown as Record<string, unknown>,
      })

      showToast('Coupon created successfully!', 'success')
      router.push('/coupons')
    } catch (error) {
      console.error('Error creating coupon:', error)
      showToast('Failed to create coupon. Please try again.', 'error')
    } finally {
      fullLoading.close()
    }
  }

  // Options for select fields
  const typeOptions = [
    { value: CouponType.PERCENTAGE, label: 'Percentage' },
    { value: CouponType.FIXED_AMOUNT, label: 'Fixed Amount' },
    { value: CouponType.FREE_SHIPPING, label: 'Free Shipping' },
  ]

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>Add New Coupon</h1>
        <Button label='Back to Coupons' variant='outlinePrimary' onClick={() => router.push('/coupons')} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Basic Information</h2>
          </div>
          <div className='space-y-4'>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField control={control} name='code' label='Coupon Code' placeholder='e.g., SAVE20, WELCOME10' />
              </GridItem>
              <GridItem>
                <TextField
                  control={control}
                  name='description'
                  label='Description'
                  placeholder='Brief description of the coupon'
                />
              </GridItem>
            </Grid>
          </div>
        </Card>

        {/* Discount Configuration */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Discount Configuration</h2>
          </div>
          <div className='space-y-4'>
            <Grid col={{ default: 1, md: 2, lg: 3 }} rowGap={4} colGap={4}>
              <GridItem>
                <SelectField control={control} name='type' label='Discount Type' items={typeOptions} />
              </GridItem>
              {watchedType !== CouponType.FREE_SHIPPING && (
                <GridItem>
                  <TextField
                    control={control}
                    name='value'
                    label={watchedType === CouponType.PERCENTAGE ? 'Percentage (%)' : 'Amount ($)'}
                    type='number'
                    placeholder={watchedType === CouponType.PERCENTAGE ? '10' : '25.00'}
                  />
                </GridItem>
              )}
              {watchedType === CouponType.PERCENTAGE && (
                <GridItem>
                  <TextField
                    control={control}
                    name='maximumDiscount'
                    label='Maximum Discount ($)'
                    type='number'
                    placeholder='Optional maximum discount cap'
                  />
                </GridItem>
              )}
            </Grid>
          </div>
        </Card>

        {/* Usage Configuration */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Usage Configuration</h2>
          </div>
          <div className='space-y-4'>
            <Grid col={{ default: 1, md: 2, lg: 3 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField
                  control={control}
                  name='usageLimit'
                  label='Usage Limit'
                  type='number'
                  placeholder='Leave empty for unlimited'
                />
              </GridItem>
              <GridItem>
                <TextField
                  control={control}
                  name='minimumAmount'
                  label='Minimum Order Amount ($)'
                  type='number'
                  placeholder='Optional minimum order requirement'
                />
              </GridItem>
            </Grid>
          </div>
        </Card>

        {/* Validity Period */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Validity Period</h2>
          </div>
          <div className='space-y-4'>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField control={control} name='startDate' label='Valid From' type='datetime-local' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='endDate' label='Valid Until' type='datetime-local' />
              </GridItem>
            </Grid>
          </div>
        </Card>

        {/* Applicability */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Applicability</h2>
            <p className='text-sm text-gray-600'>
              If no categories or products are selected, the coupon will apply to all products (site-wide).
            </p>
          </div>
          <div className='space-y-4'>
            <Grid col={{ default: 1 }} rowGap={4} colGap={4}>
              <GridItem>
                <MultiSelectField
                  control={control}
                  name='applicableCategories'
                  label='Applicable Categories'
                  items={categoryOptions}
                  placeholder='Select categories (optional)'
                />
              </GridItem>
              <GridItem>
                <MultiSelectField
                  control={control}
                  name='applicableProducts'
                  label='Applicable Products'
                  items={productOptions}
                  placeholder='Select specific products (optional)'
                />
              </GridItem>
            </Grid>
          </div>
        </Card>

        {/* Additional Settings */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Additional Settings</h2>
          </div>
          <div className='space-y-4'>
            <CheckboxField control={control} name='isActive' label='Active' />
          </div>
        </Card>

        {/* Submit Actions */}
        <Card>
          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              label='Cancel'
              variant='outlinePrimary'
              onClick={() => router.push('/coupons')}
            />
            <Button type='submit' label='Create Coupon' disabled={createDataSource.isPending} />
          </div>
        </Card>
      </form>
    </div>
  )
}
