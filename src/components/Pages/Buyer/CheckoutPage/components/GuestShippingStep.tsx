import React, { useEffect, useState, useRef } from 'react'

import { useForm } from 'react-hook-form'

import { GuestMigrationModal } from '@/components/Auth/GuestMigrationModal'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'

import { useCheckout } from '../context/CheckoutContext'

interface GuestShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface GuestShippingStepProps {
  onNext: () => void
  onBack: () => void
}

export const GuestShippingStep: React.FC<GuestShippingStepProps> = ({ onNext, onBack }) => {
  const { checkoutData, onDataUpdate, onCalculateShipping, isCalculatingShipping } = useCheckout()
  const [showMigrationModal, setShowMigrationModal] = useState(false)

  const { control, handleSubmit, watch, setValue } = useForm<GuestShippingForm>({
    defaultValues: {
      firstName: checkoutData.shipping.firstName || '',
      lastName: checkoutData.shipping.lastName || '',
      email: checkoutData.shipping.email || '',
      phone: checkoutData.shipping.phone || '',
      addressLine1: checkoutData.shipping.address || '',
      addressLine2: '',
      city: checkoutData.shipping.city || '',
      state: checkoutData.shipping.state || '',
      postalCode: checkoutData.shipping.zipCode || '',
      country: checkoutData.shipping.country || 'US',
    },
  })

  // Remove the useEffect that was causing infinite loops
  // We'll update checkout data only when form is submitted

  const onSubmit = async (data: GuestShippingForm) => {
    try {
      // Update checkout data with form values
      onDataUpdate('shipping', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.postalCode,
        country: data.country,
      })

      // Calculate shipping with the provided address
      await onCalculateShipping()

      // Update billing data to match shipping if "same as shipping" is checked
      if (checkoutData.billing.sameAsShipping) {
        onDataUpdate('billing', {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.addressLine1,
          city: data.city,
          state: data.state,
          zipCode: data.postalCode,
          country: data.country,
        })
      }

      onNext()
    } catch (error) {
      console.error('Error calculating shipping:', error)
    }
  }

  const handleCreateAccount = () => {
    setShowMigrationModal(true)
  }

  const handleMigrationSuccess = () => {
    // Refresh the page to update the session and show authenticated checkout
    window.location.reload()
  }

  return (
    <div className='space-y-6'>
      <div>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Shipping Information</h2>
            <p className='mt-2 text-gray-600'>Please provide your shipping address for delivery.</p>
          </div>
          <Button
            type='button'
            label='Create Account'
            variant='outlinePrimary'
            onClick={handleCreateAccount}
            className='whitespace-nowrap'
          />
        </div>
        
        {/* Info banner */}
        <div className='rounded-md border border-blue-200 bg-blue-50 p-3'>
          <p className='text-sm text-blue-800'>
            ✨ <strong>Want to save time?</strong> Create an account to save your address, track orders, and get faster 
            checkout next time!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <TextField
            control={control}
            name='firstName'
            label='First Name'
            placeholder='Enter your first name'
            rules={{ required: 'First name is required' }}
          />
          <TextField
            control={control}
            name='lastName'
            label='Last Name'
            placeholder='Enter your last name'
            rules={{ required: 'Last name is required' }}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <TextField
            control={control}
            name='email'
            label='Email Address'
            type='email'
            placeholder='Enter your email'
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
          />
          <TextField
            control={control}
            name='phone'
            label='Phone Number'
            placeholder='Enter your phone number'
            rules={{ required: 'Phone number is required' }}
          />
        </div>

        {/* Address Information */}
        <div className='space-y-4'>
          <TextField
            control={control}
            name='addressLine1'
            label='Address Line 1'
            placeholder='Enter your street address'
            rules={{ required: 'Address is required' }}
          />
          <TextField
            control={control}
            name='addressLine2'
            label='Address Line 2 (Optional)'
            placeholder='Apartment, suite, etc.'
          />
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <TextField
            control={control}
            name='city'
            label='City'
            placeholder='Enter your city'
            rules={{ required: 'City is required' }}
          />
          <TextField
            control={control}
            name='state'
            label='State/Province'
            placeholder='Enter your state'
            rules={{ required: 'State is required' }}
          />
          <TextField
            control={control}
            name='postalCode'
            label='Postal Code'
            placeholder='Enter your postal code'
            rules={{ required: 'Postal code is required' }}
          />
        </div>

        <TextField
          control={control}
          name='country'
          label='Country'
          placeholder='Enter your country'
          rules={{ required: 'Country is required' }}
        />

        {/* Navigation Buttons */}
        <div className='flex justify-between pt-6'>
          <Button
            type='button'
            label='Back'
            variant='outlinePrimary'
            onClick={onBack}
            disabled={isCalculatingShipping}
          />
          <Button
            type='submit'
            label={isCalculatingShipping ? 'Calculating...' : 'Continue to Billing'}
            disabled={isCalculatingShipping}
          />
        </div>
      </form>

      <GuestMigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onSuccess={handleMigrationSuccess}
      />
    </div>
  )
}
