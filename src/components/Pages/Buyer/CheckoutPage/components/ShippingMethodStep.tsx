import type { ShippingOption } from '@/services/checkout.services'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/common/Button'

import { useCheckout } from '../context/CheckoutContext'

export const ShippingMethodStep: React.FC = () => {
  const { 
    shippingOptions, 
    selectedShippingOption, 
    onSelectShippingOption, 
    onCalculateShipping,
    onStepChange,
    isCalculatingShipping,
    onInitiateCheckout,
    isInitiating
  } = useCheckout()
  
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(selectedShippingOption)
  const [error, setError] = useState<string>('')

  // For testing, show some default shipping options if none are available
  const displayOptions = shippingOptions.length > 0 ? shippingOptions : [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 9.99,
      estimatedDays: 7,
      carrier: 'USPS',
      serviceCode: 'standard',
      trackingAvailable: true
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 19.99,
      estimatedDays: 3,
      carrier: 'FedEx',
      serviceCode: 'express',
      trackingAvailable: true
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 39.99,
      estimatedDays: 1,
      carrier: 'FedEx',
      serviceCode: 'overnight',
      guaranteedDelivery: true,
      trackingAvailable: true
    }
  ]

  useEffect(() => {
    console.log('ShippingMethodStep: shippingOptions changed:', shippingOptions)
    console.log('ShippingMethodStep: selectedOption:', selectedOption)
    
    // Auto-select the first option if none is selected
    if (displayOptions.length > 0 && !selectedOption) {
      console.log('Auto-selecting first shipping option:', displayOptions[0])
      setSelectedOption(displayOptions[0])
    }
  }, [shippingOptions, selectedOption, displayOptions])

  // Call calculate shipping API when component mounts
  useEffect(() => {
    const loadShippingOptions = async () => {
      try {
        console.log('Loading shipping options on component mount')
        await onCalculateShipping()
      } catch (err) {
        console.error('Failed to load shipping options:', err)
      }
    }
    
    // Only call if we don't have shipping options yet and haven't already called it
    if (shippingOptions.length === 0 && !isCalculatingShipping) {
      loadShippingOptions()
    }
  }, []) // Empty dependency array - only run once on mount

  const handleSelectOption = (option: ShippingOption) => {
    setSelectedOption(option)
    onSelectShippingOption(option)
  }

  const handleNext = async () => {
    if (!selectedOption) {
      setError('Please select a shipping method')
      return
    }
    
    setError('')
    
    try {
      // Call initiate checkout API
      await onInitiateCheckout()
      // Move to payment step
      onStepChange('payment')
    } catch (err) {
      console.error('Failed to initiate checkout:', err)
      setError('Failed to initiate checkout. Please try again.')
    }
  }

  const handleBack = () => {
    onStepChange('billing')
  }

  if (displayOptions.length === 0) {
    return (
      <div className='space-y-4'>
        <div className='py-8 text-center'>
          <p className='text-gray-600'>Loading shipping options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Select Shipping Method</h2>
        <p className='mb-6 text-gray-600'>Choose how you would like your order to be delivered.</p>
      </div>

      <div className='space-y-4'>
        {displayOptions.map((option) => (
          <div
            key={option.id}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedOption?.id === option.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelectOption(option)}
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='flex items-center space-x-3'>
                  <input
                    type='radio'
                    name='shipping-method'
                    checked={selectedOption?.id === option.id}
                    onChange={() => handleSelectOption(option)}
                    className='text-primary focus:ring-primary'
                  />
                  <div>
                    <h3 className='font-medium'>{option.name}</h3>
                    <p className='text-sm text-gray-600'>{option.description}</p>
                    <p className='text-sm text-gray-500'>
                      Estimated delivery: {option.estimatedDays} day{option.estimatedDays !== 1 ? 's' : ''}
                    </p>
                    {option.guaranteedDelivery && (
                      <p className='text-sm text-green-600 font-medium'>✓ Guaranteed Delivery</p>
                    )}
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-lg font-semibold'>${option.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div className='text-sm text-red-500'>{error}</div>}

      <div className='flex justify-between pt-6'>
        <Button type='button' onClick={handleBack} label='Back'>
          Back
        </Button>
        <Button 
          type='button' 
          onClick={handleNext} 
          label='Continue to Payment' 
          disabled={!selectedOption || isCalculatingShipping || isInitiating}
        >
          {isInitiating ? 'Initiating...' : 'Continue to Payment'}
        </Button>
      </div>
    </div>
  )
}
