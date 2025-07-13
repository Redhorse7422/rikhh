'use client'

import type { ZONE_TYPE } from '@/types/shipping'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'

import { useShippingZoneFilter } from './ShippingZoneFilterContext'

const zoneTypeOptions = [
  { value: '', label: 'All Zone Types' },
  { value: 'country', label: 'Country' },
  { value: 'state', label: 'State' },
  { value: 'city', label: 'City' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'custom', label: 'Custom' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface FormData {
  search: string
  zoneType: string
  status: string
}

export const FormFilter = () => {
  const { filters, updateFilters, resetFilters } = useShippingZoneFilter()
  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: {
      search: filters.search || '',
      zoneType: filters.zoneType || '',
      status: filters.isActive?.toString() || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateFilters({
      search: data.search,
      zoneType: (data.zoneType as ZONE_TYPE) || undefined,
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
        <TextField name='search' control={control} label='Search Zones' placeholder='Search by name, description...' />
      </div>
      <div className='w-full md:w-48'>
        <SelectField name='zoneType' control={control} label='Zone Type' items={zoneTypeOptions} />
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
