'use client'

import type { RATE_TYPE } from '@/types/shipping'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'

import { useShippingRateFilter } from './ShippingRateFilterContext'

const rateTypeOptions = [
  { value: '', label: 'All Rate Types' },
  { value: 'flat_rate', label: 'Flat Rate' },
  { value: 'weight_based', label: 'Weight Based' },
  { value: 'price_based', label: 'Price Based' },
  { value: 'distance_based', label: 'Distance Based' },
  { value: 'free', label: 'Free' },
  { value: 'item_based', label: 'Item Based' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface FormData {
  search: string
  rateType: string
  status: string
}

export const FormFilter = () => {
  const { filters, updateFilters, resetFilters } = useShippingRateFilter()
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      search: filters.search || '',
      rateType: filters.rateType || '',
      status: filters.isActive?.toString() || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateFilters({
      search: data.search,
      rateType: (data.rateType as RATE_TYPE) || undefined,
      isActive: data.status === 'true' ? true : data.status === 'false' ? false : undefined,
      page: 1,
    })
  }

  const handleReset = () => {
    reset()
    resetFilters()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 md:flex-row md:items-end'>
      <div className='flex-1'>
        <TextField name='search' control={control} label='Search Rates' placeholder='Search by name, description...' />
      </div>
      <div className='w-full md:w-48'>
        <SelectField name='rateType' control={control} label='Rate Type' items={rateTypeOptions} />
      </div>
      <div className='w-full md:w-48'>
        <SelectField name='status' control={control} label='Status' items={statusOptions} />
      </div>
      <div className='flex gap-2'>
        <Button label='Reset' variant='outlinePrimary' onClick={handleReset} type='button' />
        <Button label='Apply' variant='primary' type='submit' />
      </div>
    </form>
  )
}
