'use client'

import type { ShippingMethod, CreateShippingMethodDto, ShippingZone } from '@/types/shipping'

import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal/Modal'
import { shippingMethodsApi, shippingZonesApi } from '@/services/shipping.services'
import { METHOD_TYPE, CARRIER_TYPE } from '@/types/shipping'

const methodTypeOptions = [
  { value: 'flat_rate', label: 'Flat Rate' },
  { value: 'free_shipping', label: 'Free Shipping' },
  { value: 'weight_based', label: 'Weight Based' },
  { value: 'price_based', label: 'Price Based' },
  { value: 'distance_based', label: 'Distance Based' },
]

const carrierTypeOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'premium', label: 'Premium' },
  { value: 'economy', label: 'Economy' },
  { value: 'same_day', label: 'Same Day' },
  { value: 'next_day', label: 'Next Day' },
]

interface MethodModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  method?: ShippingMethod | null
}

export const MethodModal = ({ open, onClose, onSuccess, method }: MethodModalProps) => {
  const isEdit = !!method
  const [loading, setLoading] = useState(false)
  const [zones, setZones] = useState<any[]>([])
  const [zonesLoading, setZonesLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm<CreateShippingMethodDto>({
    defaultValues: method
      ? {
          name: method.name,
          description: method.description || '',
          methodType: method.methodType,
          carrierType: method.carrierType,
          zoneId: method.zoneId || '',
          isActive: method.isActive,
          priority: method.priority,
          estimatedDays: method.estimatedDays || 0,
          icon: method.icon || '',
          color: method.color || '',
          isDefault: method.isDefault,
          requiresSignature: method.requiresSignature,
          isInsured: method.isInsured,
          insuranceAmount: method.insuranceAmount || 0,
        }
      : {
          name: '',
          description: '',
          methodType: METHOD_TYPE.FLAT_RATE,
          carrierType: CARRIER_TYPE.STANDARD,
          zoneId: '',
          isActive: true,
          priority: 1,
          estimatedDays: 3,
          icon: '',
          color: '',
          isDefault: false,
          requiresSignature: false,
          isInsured: false,
          insuranceAmount: 0,
        },
  })

  // Fetch zones when modal opens
  useEffect(() => {
    if (open) {
      fetchZones()
    }
  }, [open])

  const fetchZones = async () => {
    setZonesLoading(true)
    try {
      const response = await shippingZonesApi.getActive()
      console.log('Zone Respoense ==> ', response)
      const zoneOptions = Array.isArray(response) ? response : []
      console.log('Zone ==> ', zoneOptions)
      setZones(zoneOptions)
    } catch (error) {
      console.error('Error fetching zones:', error)
    } finally {
      setZonesLoading(false)
    }
  }

  const zoneOptions = [
    { value: '', label: 'Global (No Zone)' },
    ...zones.map((zone) => ({
      value: zone.id,
      label: `${zone.name} (${zone.zoneType})`,
    })),
  ]

  const onSubmit = async (data: CreateShippingMethodDto) => {
    setLoading(true)
    try {
      if (isEdit && method) {
        await shippingMethodsApi.update(method.id, data)
      } else {
        await shippingMethodsApi.create(data)
      }
      onSuccess()
      onClose()
      reset()
    } catch (e) {
      // TODO: Show error toast
      console.error('Error saving method:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Shipping Method' : 'Add Shipping Method'} size='lg'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <TextField name='name' control={control} label='Method Name' required />
        <TextField name='description' control={control} label='Description' />

        <div className='grid grid-cols-2 gap-4'>
          <SelectField name='methodType' control={control} label='Method Type' items={methodTypeOptions} required />
          <SelectField name='carrierType' control={control} label='Carrier Type' items={carrierTypeOptions} required />
        </div>

        <SelectField
          name='zoneId'
          control={control}
          label='Shipping Zone'
          items={zoneOptions}
          placeholder={zonesLoading ? 'Loading zones...' : 'Select a zone or leave as global'}
        />

        <div className='grid grid-cols-2 gap-4'>
          <TextField name='priority' control={control} label='Priority' type='number' required />
          <TextField name='estimatedDays' control={control} label='Estimated Days' type='number' />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <TextField name='icon' control={control} label='Icon' placeholder='Icon name or URL' />
          <TextField name='color' control={control} label='Color' placeholder='e.g. #FF0000' />
        </div>

        <div className='grid grid-cols-2 gap-4'>
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
          <SelectField
            name='isDefault'
            control={control}
            label='Default Method'
            items={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <SelectField
            name='requiresSignature'
            control={control}
            label='Requires Signature'
            items={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
            required
          />
          <SelectField
            name='isInsured'
            control={control}
            label='Insured'
            items={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
            required
          />
        </div>

        <TextField name='insuranceAmount' control={control} label='Insurance Amount' type='number' />

        <div className='mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <Button label='Cancel' variant='outlineDark' onClick={onClose} type='button' disabled={loading} />
          <Button label={isEdit ? 'Update' : 'Create'} variant='primary' type='submit' loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
