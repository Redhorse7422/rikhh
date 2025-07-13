'use client'

import type { METHOD_TYPE, CARRIER_TYPE } from '@/types/shipping'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'

import { useShippingMethodFilter } from './ShippingMethodFilterContext'

const methodTypeOptions = [
  { value: '', label: 'All Method Types' },
  { value: 'flat_rate', label: 'Flat Rate' },
  { value: 'free_shipping', label: 'Free Shipping' },
  { value: 'weight_based', label: 'Weight Based' },
  { value: 'price_based', label: 'Price Based' },
  { value: 'distance_based', label: 'Distance Based' },
]

const carrierTypeOptions = [
  { value: '', label: 'All Carrier Types' },
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'premium', label: 'Premium' },
  { value: 'economy', label: 'Economy' },
  { value: 'same_day', label: 'Same Day' },
  { value: 'next_day', label: 'Next Day' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface FormData {
  search: string
  methodType: string
  carrierType: string
  status: string
}

export const FormFilter = () => {
  const { filters, updateFilters, resetFilters } = useShippingMethodFilter()
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      search: filters.search || '',
      methodType: filters.methodType || '',
      carrierType: filters.carrierType || '',
      status: filters.isActive?.toString() || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateFilters({
      search: data.search,
      methodType: (data.methodType as METHOD_TYPE) || undefined,
      carrierType: (data.carrierType as CARRIER_TYPE) || undefined,
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
        <TextField
          name='search'
          control={control}
          label='Search Methods'
          placeholder='Search by name, description...'
        />
      </div>
      <div className='w-full md:w-48'>
        <SelectField name='methodType' control={control} label='Method Type' items={methodTypeOptions} />
      </div>
      <div className='w-full md:w-48'>
        <SelectField name='carrierType' control={control} label='Carrier Type' items={carrierTypeOptions} />
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
