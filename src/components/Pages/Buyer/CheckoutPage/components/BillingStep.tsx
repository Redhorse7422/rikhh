import React, { useState, useEffect } from 'react'

import { TextInput } from '@/components/FormElements/TextInput/TextInput'
import { Button } from '@/components/common/Button'
import { useAddresses } from '@/hooks/useAddresses'

import { useCheckout } from '../context/CheckoutContext'

export const BillingStep: React.FC = () => {
  const {
    checkoutData,
    onDataUpdate,
    onStepChange,
    onSelectBillingAddress,
    selectedBillingAddressId,
    selectedShippingAddressId,
  } = useCheckout()
  const { getBillingAddresses, getDefaultBillingAddress } = useAddresses()
  const [form, setForm] = useState(checkoutData.billing)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-populate with default billing address if available and not same as shipping
  useEffect(() => {
    if (!form.sameAsShipping) {
      const defaultAddress = getDefaultBillingAddress()
      if (defaultAddress && !form.firstName) {
        setForm((prev) => ({
          ...prev,
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          email: '', // Email not in address data, will need to be entered manually
          phone: defaultAddress.phone,
          address:
            defaultAddress.addressLine1 + (defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''),
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.postalCode,
          country: defaultAddress.country,
        }))
      }
      // Preselect default address if none is selected
      if (defaultAddress && !selectedBillingAddressId) {
        onSelectBillingAddress(defaultAddress.id)
      }
    }
  }, [form.sameAsShipping, getDefaultBillingAddress, form.firstName, selectedBillingAddressId, onSelectBillingAddress])

  const handleAddressSelect = (address: any) => {
    setForm((prev) => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      email: '', // Email not in address data, will need to be entered manually
      phone: address.phone,
      address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
      city: address.city,
      state: address.state,
      zipCode: address.postalCode,
      country: address.country,
    }))
    // Set the selected billing address ID
    onSelectBillingAddress(address.id)
  }

  const handleNext = () => {
    if (!form.sameAsShipping && (!form.firstName || !form.lastName || !form.email || !form.address)) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    onDataUpdate('billing', form)

    // Move to shipping method step
    onStepChange('shipping-method')
  }

  const handleBack = () => {
    onStepChange('shipping')
  }

  const billingAddresses = getBillingAddresses()

  return (
    <div className='space-y-6'>
      {/* Existing Billing Addresses Section */}
      {!form.sameAsShipping && billingAddresses.length > 0 && (
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
          <h3 className='mb-3 text-lg font-medium'>Saved Billing Addresses</h3>
          <div className='space-y-2'>
            {billingAddresses.map((address) => (
              <div
                key={address.id}
                className={`cursor-pointer rounded border p-3 transition-colors ${
                  selectedBillingAddressId === address.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-primary'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>
                      {address.firstName} {address.lastName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state}{' '}
                      {address.postalCode}
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
        <div className='mb-2 flex items-center'>
          <input
            type='checkbox'
            checked={form.sameAsShipping}
            onChange={(e) => {
              const checked = e.target.checked
              setForm((f) => ({ ...f, sameAsShipping: checked }))
              if (checked && selectedShippingAddressId) {
                onSelectBillingAddress(selectedShippingAddressId)
              }
            }}
            id='sameAsShipping'
          />
          <label htmlFor='sameAsShipping' className='ml-2'>
            Same as shipping address
          </label>
        </div>
        {!form.sameAsShipping && (
          <>
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
            <TextInput
              label='Address'
              value={form.address}
              onChange={(v) => handleChange('address', v || '')}
              required
            />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <TextInput label='City' value={form.city} onChange={(v) => handleChange('city', v || '')} />
              <TextInput label='State' value={form.state} onChange={(v) => handleChange('state', v || '')} />
              <TextInput label='Zip Code' value={form.zipCode} onChange={(v) => handleChange('zipCode', v || '')} />
            </div>
            <TextInput label='Country' value={form.country} onChange={(v) => handleChange('country', v || '')} />
          </>
        )}
        {error && <div className='text-red-500'>{error}</div>}
        <div className='flex justify-between'>
          <Button type='button' onClick={handleBack} label='Back'>
            Back
          </Button>
          <Button type='submit' label='Next'>
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
