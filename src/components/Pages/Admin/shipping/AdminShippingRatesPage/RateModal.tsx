'use client'

import type { ShippingRate, CreateShippingRateDto } from '@/types/shipping'

import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal/Modal'
import { shippingRatesApi, shippingMethodsApi } from '@/services/shipping.services'
import { RATE_TYPE } from '@/types/shipping'

const rateTypeOptions = [
  { value: 'flat_rate', label: 'Flat Rate' },
  { value: 'weight_based', label: 'Weight Based' },
  { value: 'price_based', label: 'Price Based' },
  { value: 'item_based', label: 'Item Based' },
  { value: 'distance_based', label: 'Distance Based' },
]

interface RateModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  rate?: ShippingRate | null
}

export const RateModal = ({ open, onClose, onSuccess, rate }: RateModalProps) => {
  const isEdit = !!rate
  const [loading, setLoading] = useState(false)
  const [methods, setMethods] = useState<any[]>([])
  const [methodsLoading, setMethodsLoading] = useState(false)
  const [rateType, setRateType] = useState<string>(rate?.rateType || 'flat_rate')

  const { control, handleSubmit, reset, watch } = useForm<CreateShippingRateDto>({
    defaultValues: rate
      ? {
          name: rate.name,
          description: rate.description || '',
          rateType: rate.rateType,
          methodId: rate.methodId,
          baseRate: rate.baseRate,
          additionalItemRate: rate.additionalItemRate || 0,
          firstItemCount: Number(rate.firstItemCount) || 0,
          maxItems: rate.maxItems || 0,
          minWeight: rate.minWeight || 0,
          maxWeight: rate.maxWeight || 0,
          minOrderValue: rate.minOrderValue || 0,
          maxOrderValue: rate.maxOrderValue || 0,
          isActive: rate.isActive,
        }
      : {
          name: '',
          description: '',
          rateType: RATE_TYPE.FLAT_RATE,
          methodId: '',
          baseRate: 0,
          additionalItemRate: 0,
          firstItemCount: 0,
          maxItems: 0,
          minWeight: 0,
          maxWeight: 0,
          minOrderValue: 0,
          maxOrderValue: 0,
          isActive: true,
        },
  })

  const watchedRateType = watch('rateType')

  // Fetch methods when modal opens
  useEffect(() => {
    if (open) {
      fetchMethods()
    }
  }, [open])

  // Update rateType state when form value changes
  useEffect(() => {
    setRateType(watchedRateType)
  }, [watchedRateType])

  const fetchMethods = async () => {
    setMethodsLoading(true)
    try {
      const response = await shippingMethodsApi.getActive()
      const methodOptions = Array.isArray(response) ? response : []
      setMethods(methodOptions)
    } catch (error) {
      console.error('Error fetching methods:', error)
    } finally {
      setMethodsLoading(false)
    }
  }

  const methodOptions = methods.map((method) => ({
    value: method.id,
    label: method.name,
  }))

  const onSubmit = async (data: CreateShippingRateDto) => {
    setLoading(true)
    try {
      // Convert string values to numbers for numeric fields
      const processedData = {
        ...data,
        baseRate: Number(data.baseRate),
        additionalItemRate: Number(data.additionalItemRate),
        firstItemCount: Number(data.firstItemCount),
        maxItems: Number(data.maxItems),
        minWeight: Number(data.minWeight),
        maxWeight: Number(data.maxWeight),
        minOrderValue: Number(data.minOrderValue),
        maxOrderValue: Number(data.maxOrderValue),
        isActive: typeof data.isActive === 'string' ? data.isActive === 'true' : Boolean(data.isActive),
      }

      if (isEdit && rate) {
        await shippingRatesApi.update(rate.id, processedData)
      } else {
        await shippingRatesApi.create(processedData)
      }
      onSuccess()
      onClose()
      reset()
    } catch (e) {
      // TODO: Show error toast
      console.error('Error saving rate:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Shipping Rate' : 'Add Shipping Rate'} size='lg'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <TextField name='name' control={control} label='Rate Name' required />
        <TextField name='description' control={control} label='Description' />

        <div className='grid grid-cols-2 gap-4'>
          <SelectField name='rateType' control={control} label='Rate Type' items={rateTypeOptions} required />
          <SelectField
            name='methodId'
            control={control}
            label='Shipping Method'
            items={methodOptions}
            placeholder={methodsLoading ? 'Loading methods...' : 'Select a method'}
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <TextField name='baseRate' control={control} label='Base Rate' type='number' required />
        </div>

        {/* Item-based specific fields */}
        {rateType === 'item_based' && (
          <div className='grid grid-cols-2 gap-4'>
            <TextField name='firstItemCount' control={control} label='First Item Count' type='number' />
            <TextField name='additionalItemRate' control={control} label='Additional Item Rate' type='number' />
          </div>
        )}

        {/* Weight-based specific fields */}
        {rateType === 'weight_based' && (
          <div className='grid grid-cols-2 gap-4'>
            <TextField name='minWeight' control={control} label='Min Weight (kg)' type='number' />
            <TextField name='maxWeight' control={control} label='Max Weight (kg)' type='number' />
          </div>
        )}

        {/* Price-based specific fields */}
        {rateType === 'price_based' && (
          <div className='grid grid-cols-2 gap-4'>
            <TextField name='minOrderValue' control={control} label='Min Order Value' type='number' />
            <TextField name='maxOrderValue' control={control} label='Max Order Value' type='number' />
          </div>
        )}

        {/* Optional fields for item-based */}
        {rateType === 'item_based' && (
          <div className='grid grid-cols-2 gap-4'>
            <TextField name='maxItems' control={control} label='Max Items' type='number' />
          </div>
        )}

        <SelectField
          name='isActive'
          control={control}
          label='Status'
          items={[
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' },
          ]}
          required
        />

        <div className='mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <Button label='Cancel' variant='outlineDark' onClick={onClose} type='button' disabled={loading} />
          <Button label={isEdit ? 'Update' : 'Create'} variant='primary' type='submit' loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
