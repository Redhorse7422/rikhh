'use client'
import type { ShippingZone, CreateShippingZoneDto } from '@/types/shipping'

import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput/SelectField'
import { TextField } from '@/components/FormElements/TextInput/TextField'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal/Modal'
import { shippingZonesApi } from '@/services/shipping.services'
import { ZONE_TYPE } from '@/types/shipping'

const zoneTypeOptions = [
  { value: 'country', label: 'Country' },
  { value: 'state', label: 'State' },
  { value: 'city', label: 'City' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'custom', label: 'Custom' },
]

interface ZoneModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  zone?: ShippingZone | null
}

export const ZoneModal = ({ open, onClose, onSuccess, zone }: ZoneModalProps) => {
  const isEdit = !!zone
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, reset } = useForm<CreateShippingZoneDto>({
    defaultValues: zone
      ? {
          name: zone.name,
          description: zone.description || '',
          zoneType: zone.zoneType,
          countries: zone.countries || [],
          states: zone.states || [],
          cities: zone.cities || [],
          postalCodes: zone.postalCodes || [],
          isActive: zone.isActive,
          priority: zone.priority,
          color: zone.color || '',
        }
      : {
          name: '',
          description: '',
          zoneType: ZONE_TYPE.COUNTRY,
          countries: [],
          states: [],
          cities: [],
          postalCodes: [],
          isActive: true,
          priority: 1,
          color: '',
        },
  })

  const onSubmit = async (data: CreateShippingZoneDto) => {
    setLoading(true)
    try {
      if (isEdit && zone) {
        await shippingZonesApi.update(zone.id, data)
      } else {
        await shippingZonesApi.create(data)
      }
      onSuccess()
      onClose()
      reset()
    } catch (e) {
      // TODO: Show error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Shipping Zone' : 'Add Shipping Zone'}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <TextField name='name' control={control} label='Zone Name' required />
        <TextField name='description' control={control} label='Description' />
        <SelectField name='zoneType' control={control} label='Zone Type' items={zoneTypeOptions} required />
        {/* TODO: Add country/state/city/postal code multi-selects based on zoneType */}
        <TextField name='priority' control={control} label='Priority' type='number' required />
        <TextField name='color' control={control} label='Color' placeholder='e.g. #FF0000' />
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
        <div className='flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4'>
          <Button label='Cancel' variant='outlineDark' onClick={onClose} type='button' disabled={loading} />
          <Button label={isEdit ? 'Update' : 'Create'} variant='primary' type='submit' loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
