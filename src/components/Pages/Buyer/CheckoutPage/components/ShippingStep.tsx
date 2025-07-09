import React, { useState, useEffect } from 'react'

import { TextInput } from '@/components/FormElements/TextInput/TextInput'
import { Button } from '@/components/common/Button'
import { useAddresses } from '@/hooks/useAddresses'
import { createAddress } from '@/services/addresses.services'

import { useCheckout } from '../context/CheckoutContext'

export const ShippingStep: React.FC = () => {
  const { checkoutData, onDataUpdate, onStepChange, onSelectShippingAddress, selectedShippingAddressId } = useCheckout()
  const {
    getShippingAddresses,
    getDefaultShippingAddress,
    isLoading: addressesLoading,
    refetch,
    isAuthenticated,
  } = useAddresses()
  const [form, setForm] = useState(checkoutData.shipping)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear selected address ID when form data changes
    if (selectedShippingAddressId && selectedShippingAddressId !== 'temp-shipping-address') {
      onSelectShippingAddress('')
    }
  }

  // Auto-populate with default address if available
  useEffect(() => {
    const defaultAddress = getDefaultShippingAddress()
    if (defaultAddress && !form.firstName) {
      setForm({
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        email: defaultAddress.email ?? '',
        phone: defaultAddress.phone,
        address: defaultAddress.addressLine1 + (defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''),
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      })
    }
    // Preselect default address if none is selected
    if (defaultAddress && !selectedShippingAddressId) {
      onSelectShippingAddress(defaultAddress.id)
    }
  }, [getDefaultShippingAddress, form.firstName, selectedShippingAddressId, onSelectShippingAddress])

  const handleAddressSelect = (address: any) => {
    const addressFormData = {
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email || '', // Email will be included in address data from backend
      phone: address.phone,
      address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
      city: address.city,
      state: address.state,
      zipCode: address.postalCode,
      country: address.country,
    }

    setForm(addressFormData)
    // Update checkout data with the selected address
    onDataUpdate('shipping', addressFormData)
    // Set the selected shipping address ID
    onSelectShippingAddress(address.id)
  }

  const handleAddAddress = async () => {
    // Validate form
    if (!form.firstName || !form.lastName || !form.address || !form.city) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isAuthenticated) {
      // For guests, just proceed to next step
      handleNext()
      return
    }

    try {
      setIsAddingAddress(true)
      setError(null)

      const addressResponse = await createAddress({
        type: 'shipping',
        firstName: form.firstName,
        lastName: form.lastName,
        addressLine1: form.address,
        email: form.email,
        city: form.city,
        state: form.state,
        postalCode: form.zipCode,
        country: form.country,
        phone: form.phone,
        isDefault: getShippingAddresses().length === 0, // Set as default if no addresses exist
      })

      if (addressResponse.code === 0) {
        // Refresh addresses to include the new one
        await refetch()

        // Select the newly created address
        onSelectShippingAddress(addressResponse.data.id)

        // Update checkout data
        onDataUpdate('shipping', form)

        // Hide the form and show the address list
        setShowAddForm(false)
      }
    } catch (err) {
      console.error('Failed to create address:', err)
      setError('Failed to save address. Please try again.')
    } finally {
      setIsAddingAddress(false)
    }
  }

  const handleAddNewAddress = () => {
    setShowAddForm(true)
    setError(null)
    // Clear any selected address when adding new
    onSelectShippingAddress('')
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
    setError(null)
    // Reset form to selected address data if any
    if (
      selectedShippingAddressId &&
      selectedShippingAddressId !== 'temp-shipping-address' &&
      selectedShippingAddressId !== ''
    ) {
      const selectedAddress = shippingAddresses.find((addr) => addr.id === selectedShippingAddressId)
      if (selectedAddress) {
        setForm({
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          email: selectedAddress.email ?? '',
          phone: selectedAddress.phone,
          address:
            selectedAddress.addressLine1 + (selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''),
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        })
      }
    }
  }

  const handleNext = () => {
    // Validate required fields
    if (!form.firstName || !form.lastName || !form.address || !form.email) {
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
      {!showAddForm ? (
        <>
          {/* Existing Addresses Section */}
          {shippingAddresses.length > 0 && (
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-lg font-medium'>Saved Shipping Addresses</h3>
              <div className='space-y-2'>
                {shippingAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`cursor-pointer rounded border p-3 transition-colors ${
                      selectedShippingAddressId === address.id
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

          {/* Add New Address Button */}
          {isAuthenticated && (
            <div className='flex justify-center'>
              <Button type='button' label='Add New Address' onClick={handleAddNewAddress} variant='outlinePrimary' />
            </div>
          )}

          {/* Continue Button */}
          <div className='flex justify-end'>
            <Button
              type='button'
              label='Continue'
              onClick={handleNext}
              disabled={!selectedShippingAddressId && isAuthenticated}
            />
          </div>
        </>
      ) : (
        <>
          {/* Add New Address Form */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Add New Shipping Address</h3>
              <Button type='button' label='Cancel' onClick={handleCancelAdd} variant='outlinePrimary' size='small' />
            </div>

            <form
              className='space-y-4'
              onSubmit={(e) => {
                e.preventDefault()
                handleAddAddress()
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
              {error && <div className='text-red-500'>{error}</div>}
              <div className='flex justify-end space-x-3'>
                <Button type='button' label='Cancel' onClick={handleCancelAdd} variant='outlinePrimary' />
                <Button
                  type='submit'
                  label={isAddingAddress ? 'Adding Address...' : 'Save Address'}
                  disabled={isAddingAddress}
                />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
