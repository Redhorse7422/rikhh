import React, { useState, useEffect } from 'react'

import { TextInput } from '@/components/FormElements/TextInput/TextInput'
import { Button } from '@/components/common/Button'
import { useAddresses } from '@/hooks/useAddresses'

import { useCheckout } from '../context/CheckoutContext'

export const ShippingStep: React.FC = () => {
  const { checkoutData, onDataUpdate, onStepChange, onSelectShippingAddress, selectedShippingAddressId } = useCheckout()
  const { getShippingAddresses, getDefaultShippingAddress, isLoading: addressesLoading } = useAddresses()
  const [form, setForm] = useState(checkoutData.shipping)
  const [error, setError] = useState<string | null>(null)
  const [useExistingAddress, setUseExistingAddress] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-populate with default address if available
  useEffect(() => {
    const defaultAddress = getDefaultShippingAddress()
    if (defaultAddress && !form.firstName) {
      setForm({
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        email: '', // Email not in address data, will need to be entered manually
        phone: defaultAddress.phone,
        address: defaultAddress.addressLine1 + (defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''),
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      })
    }
  }, [getDefaultShippingAddress, form.firstName])

  const handleAddressSelect = (address: any) => {
    setForm({
      firstName: address.firstName,
      lastName: address.lastName,
      email: '', // Email not in address data, will need to be entered manually
      phone: address.phone,
      address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
      city: address.city,
      state: address.state,
      zipCode: address.postalCode,
      country: address.country,
    })
    setUseExistingAddress(false)
    // Set the selected shipping address ID
    onSelectShippingAddress(address.id)
  }

  const handleNext = () => {
    // TODO: Add validation
    if (!form.firstName || !form.lastName || !form.email || !form.address) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    onDataUpdate('shipping', form)
    
    // If no shipping address ID is set (manual entry), set a temporary one
    if (!selectedShippingAddressId) {
      onSelectShippingAddress('temp-shipping-address')
    }
    
    onStepChange('billing')
  }

  const shippingAddresses = getShippingAddresses()

  return (
    <div className='space-y-6'>
      {/* Existing Addresses Section */}
      {shippingAddresses.length > 0 && (
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
          <h3 className='mb-3 text-lg font-medium'>Saved Shipping Addresses</h3>
          <div className='space-y-2'>
            {shippingAddresses.map((address) => (
              <div
                key={address.id}
                className='cursor-pointer rounded border border-gray-200 bg-white p-3 hover:border-primary'
                onClick={() => handleAddressSelect(address)}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>
                      {address.firstName} {address.lastName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className='text-sm text-gray-600'>{address.phone}</p>
                  </div>
                  {address.isDefault && (
                    <span className='rounded bg-primary px-2 py-1 text-xs text-white'>Default</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Form */}
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault()
          handleNext()
        }}
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <TextInput
            label='First Name'
            value={form.firstName}
            onChange={(v) => handleChange('firstName', v || '')}
            required
          />
          <TextInput
            label='Last Name'
            value={form.lastName}
            onChange={(v) => handleChange('lastName', v || '')}
            required
          />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <TextInput
            label='Email'
            type='email'
            value={form.email}
            onChange={(v) => handleChange('email', v || '')}
            required
          />
          <TextInput label='Phone' value={form.phone} onChange={(v) => handleChange('phone', v || '')} />
        </div>
        <TextInput label='Address' value={form.address} onChange={(v) => handleChange('address', v || '')} required />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <TextInput label='City' value={form.city} onChange={(v) => handleChange('city', v || '')} />
          <TextInput label='State' value={form.state} onChange={(v) => handleChange('state', v || '')} />
          <TextInput label='Zip Code' value={form.zipCode} onChange={(v) => handleChange('zipCode', v || '')} />
        </div>
        <TextInput label='Country' value={form.country} onChange={(v) => handleChange('country', v || '')} />
        {error && <div className='text-red-500'>{error}</div>}
        <div className='flex justify-end'>
          <Button type='submit' label='Next'>
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
