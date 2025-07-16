'use client'

import type { CouponFilterValues } from '@/types/coupon'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Grid, GridItem } from '@/libs/pureTailwind'
import { CouponType, CouponStatus } from '@/types/coupon'

import { useCouponFilter } from './CouponFilterContext'

interface FormData {
  search: string
  type: string
  status: string
  isActive: string
  validFrom: string
  validUntil: string
  sortBy: string
  sortOrder: string
}

const defaultValues: FormData = {
  search: '',
  type: '',
  status: '',
  isActive: '',
  validFrom: '',
  validUntil: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const FormFilter = () => {
  const { filters, setFilters } = useCouponFilter()
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      search: filters.search || '',
      type: filters.type || '',
      status: filters.status || '',
      isActive: filters.isActive?.toString() || '',
      validFrom: filters.validFrom || '',
      validUntil: filters.validUntil || '',
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
    },
  })

  const onSubmit = (data: FormData) => {
    // Clean up boolean values - don't send empty strings
    const cleanedData: CouponFilterValues = {
      search: data.search,
      type: (data.type as CouponType) || undefined,
      status: (data.status as CouponStatus) || undefined,
      isActive: data.isActive === 'true' ? true : data.isActive === 'false' ? false : undefined,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      sortBy: data.sortBy as any,
      sortOrder: data.sortOrder as any,
    }
    setFilters(cleanedData)
  }

  const handleReset = () => {
    reset(defaultValues)
    setFilters({
      search: '',
      type: '',
      status: '',
      isActive: undefined,
      validFrom: '',
      validUntil: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  // Options for select fields
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: CouponType.PERCENTAGE, label: 'Percentage' },
    { value: CouponType.FIXED_AMOUNT, label: 'Fixed Amount' },
    { value: CouponType.FREE_SHIPPING, label: 'Free Shipping' },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: CouponStatus.ACTIVE, label: 'Active' },
    { value: CouponStatus.INACTIVE, label: 'Inactive' },
    { value: CouponStatus.EXPIRED, label: 'Expired' },
    { value: CouponStatus.USED_UP, label: 'Used Up' },
  ]

  const isActiveOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ]

  const sortByOptions = [
    { value: 'code', label: 'Code' },
    { value: 'type', label: 'Type' },
    { value: 'value', label: 'Value' },
    { value: 'validFrom', label: 'Valid From' },
    { value: 'validUntil', label: 'Valid Until' },
    { value: 'usageCount', label: 'Usage Count' },
    { value: 'createdAt', label: 'Created At' },
  ]

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-4'>
        <Grid col={{ default: 1, md: 2, lg: 4 }} rowGap={4} colGap={4}>
          <GridItem colStart={{ default: 1, md: 1, lg: 1 }} colSpan={{ default: 1, md: 2, lg: 1 }}>
            <TextField control={control} name='search' label='Search' placeholder='Search by code, name...' />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 1, lg: 2 }}>
            <SelectField control={control} name='type' label='Type' items={typeOptions} />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 2, lg: 3 }}>
            <SelectField control={control} name='status' label='Status' items={statusOptions} />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 1, lg: 4 }}>
            <SelectField control={control} name='isActive' label='Active Status' items={isActiveOptions} />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 2, lg: 1 }}>
            <TextField control={control} name='validFrom' label='Valid From' type='date' />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 1, lg: 2 }}>
            <TextField control={control} name='validUntil' label='Valid Until' type='date' />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 2, lg: 3 }}>
            <SelectField control={control} name='sortBy' label='Sort By' items={sortByOptions} />
          </GridItem>

          <GridItem colStart={{ default: 1, md: 1, lg: 4 }}>
            <SelectField control={control} name='sortOrder' label='Sort Order' items={sortOrderOptions} />
          </GridItem>
        </Grid>
      </div>

      <div className='flex gap-3'>
        <Button type='submit' label='Apply Filters' />
        <Button type='button' label='Reset' variant='outlinePrimary' onClick={handleReset} />
      </div>
    </form>
  )
}
