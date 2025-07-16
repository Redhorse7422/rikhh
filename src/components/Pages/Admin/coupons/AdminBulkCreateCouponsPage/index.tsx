'use client'

import type { CreateCouponData } from '@/types/coupon'

import { useState } from 'react'

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

interface BulkCreateForm {
  baseCode: string
  quantity: number
  type: CouponType
  value: number
  isActive: boolean
  validFrom: string
  validUntil: string
  usageLimit?: number
  minimumAmount?: number
  maximumDiscount?: number
  description: string
  applicableProducts: string[]
  applicableCategories: string[]
}

export const AdminBulkCreateCouponsPage = () => {
  const router = useRouter()
  const { createDataSource, getDataSource } = useApi()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()
  const [generatedCoupons, setGeneratedCoupons] = useState<CreateCouponData[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const { control, handleSubmit, watch } = useForm<BulkCreateForm>({
    defaultValues: {
      baseCode: '',
      quantity: 10,
      type: CouponType.PERCENTAGE,
      value: 0,
      isActive: true,
      validFrom: '',
      validUntil: '',
      usageLimit: undefined,
      minimumAmount: undefined,
      maximumDiscount: undefined,
      description: '',
      applicableProducts: [],
      applicableCategories: [],
    },
  })

  const watchedType = watch('type')
  const watchedBaseCode = watch('baseCode')
  const watchedQuantity = watch('quantity')

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

  const generateCoupons = (data: BulkCreateForm): CreateCouponData[] => {
    const coupons: CreateCouponData[] = []

    for (let i = 1; i <= data.quantity; i++) {
      const paddedNumber = i.toString().padStart(3, '0')
      const couponCode = `${data.baseCode}${paddedNumber}`

      coupons.push({
        code: couponCode,
        type: data.type,
        value: data.value,
        isActive: data.isActive,
        startDate: data.validFrom,
        endDate: data.validUntil,
        usageLimit: data.usageLimit,
        minimumAmount: data.minimumAmount,
        maximumDiscount: data.maximumDiscount,
        description: data.description || `Bulk generated coupon ${couponCode}`,
        applicableProducts: data.applicableProducts || [],
        applicableCategories: data.applicableCategories || [],
      })
    }

    return coupons
  }

  const handlePreview = (data: BulkCreateForm) => {
    const coupons = generateCoupons(data)
    setGeneratedCoupons(coupons)
    setShowPreview(true)
  }

  const handleBulkCreate = async () => {
    if (generatedCoupons.length === 0) return

    try {
      fullLoading.open()

      const response = await createDataSource.mutateAsync({
        path: '/v1/coupons/bulk',
        body: { coupons: generatedCoupons } as unknown as Record<string, unknown>,
      })

      showToast(`Successfully created ${generatedCoupons.length} coupons!`, 'success')
      router.push('/coupons')
    } catch (error) {
      console.error('Error creating bulk coupons:', error)
      showToast('Failed to create bulk coupons. Please try again.', 'error')
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

  const quantityOptions = [
    { value: '5', label: '5 Coupons' },
    { value: '10', label: '10 Coupons' },
    { value: '25', label: '25 Coupons' },
    { value: '50', label: '50 Coupons' },
    { value: '100', label: '100 Coupons' },
  ]

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>Bulk Create Coupons</h1>
        <Button label='Back to Coupons' variant='outlinePrimary' onClick={() => router.push('/coupons')} />
      </div>

      {!showPreview ? (
        <form onSubmit={handleSubmit(handlePreview)} className='space-y-6'>
          {/* Basic Configuration */}
          <Card>
            <div className='mb-4'>
              <h2 className='text-lg font-medium text-gray-900'>Basic Configuration</h2>
              <p className='text-sm text-gray-600'>Configure the base settings for all coupons</p>
            </div>
            <div className='space-y-4'>
              <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
                <GridItem>
                  <TextField control={control} name='baseCode' label='Base Code' placeholder='e.g., SAVE, DISCOUNT' />
                  <p className='mt-1 text-sm text-gray-500'>
                    Coupons will be generated as: {watchedBaseCode}001, {watchedBaseCode}002, etc.
                  </p>
                </GridItem>
                <GridItem>
                  <SelectField control={control} name='quantity' label='Quantity' items={quantityOptions} />
                </GridItem>
                <GridItem colSpan={{ default: 1, md: 2 }}>
                  <TextField
                    control={control}
                    name='description'
                    label='Description'
                    placeholder='Description for all generated coupons'
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
              <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
                <GridItem>
                  <TextField
                    control={control}
                    name='usageLimit'
                    label='Usage Limit (per coupon)'
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
                  <TextField control={control} name='validFrom' label='Valid From' type='datetime-local' />
                </GridItem>
                <GridItem>
                  <TextField control={control} name='validUntil' label='Valid Until' type='datetime-local' />
                </GridItem>
              </Grid>
            </div>
          </Card>

          {/* Applicability */}
          <Card>
            <div className='mb-4'>
              <h2 className='text-lg font-medium text-gray-900'>Applicability</h2>
              <p className='text-sm text-gray-600'>
                If no categories or products are selected, the coupons will apply to all products (site-wide).
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
              <CheckboxField control={control} name='isActive' label='Active (all coupons will be active)' />
            </div>
          </Card>

          {/* Preview Action */}
          <Card>
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                label='Cancel'
                variant='outlinePrimary'
                onClick={() => router.push('/coupons')}
              />
              <Button type='submit' label='Preview Coupons' />
            </div>
          </Card>
        </form>
      ) : (
        <div className='space-y-6'>
          {/* Preview Header */}
          <Card>
            <div className='p-6'>
              <h2 className='text-lg font-medium text-gray-900'>Preview Generated Coupons</h2>
              <p className='text-sm text-gray-600'>
                {generatedCoupons.length} coupons will be created with the following details:
              </p>
            </div>
          </Card>

          {/* Preview Table */}
          <Card>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                      Coupon Code
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                      Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                      Value
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {generatedCoupons.slice(0, 10).map((coupon, index) => (
                    <tr key={coupon.code} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>{coupon.code}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{coupon.type}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        {coupon.type === CouponType.PERCENTAGE
                          ? `${coupon.value}%`
                          : coupon.type === CouponType.FIXED_AMOUNT
                            ? `$${coupon.value}`
                            : 'Free Shipping'}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {generatedCoupons.length > 10 && (
              <div className='bg-gray-50 px-6 py-3 text-center text-sm text-gray-500'>
                ... and {generatedCoupons.length - 10} more coupons
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                label='Back to Form'
                variant='outlinePrimary'
                onClick={() => setShowPreview(false)}
              />
              <Button
                type='button'
                label={`Create ${generatedCoupons.length} Coupons`}
                onClick={handleBulkCreate}
                disabled={createDataSource.isPending}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
