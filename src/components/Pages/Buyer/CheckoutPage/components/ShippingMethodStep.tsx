import type { ShippingOption } from '@/services/checkout.services'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/common/Button'
import { useCart } from '@/contexts/CartContext'

import { useCheckout } from '../context/CheckoutContext'

export const ShippingMethodStep: React.FC = () => {
  const { cart } = useCart()
  const {
    shippingOptions,
    selectedShippingOption,
    onSelectShippingOption,
    onCalculateShippingOptions,
    onStepChange,
    isCalculatingShipping,
    onInitiateCheckout,
    isInitiating,
    isSavingAddress,
    checkoutData,
  } = useCheckout()

  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(selectedShippingOption)
  const [error, setError] = useState<string>('')
  const [hasTriedLoading, setHasTriedLoading] = useState(false)

  useEffect(() => {
    // Auto-select the first option if none is selected
    if (shippingOptions.length > 0 && !selectedOption) {
      setSelectedOption(shippingOptions[0])
    }
  }, [shippingOptions, selectedOption])

  // Call calculate shipping API when component mounts if we don't have shipping options from initiate checkout
  useEffect(() => {
    const loadShippingOptions = async () => {
      try {
        setHasTriedLoading(true)

        // Check if we have the required data
        if (!checkoutData.shipping.firstName || !checkoutData.shipping.address || !checkoutData.shipping.city) {
          setError('Please complete shipping address first')
          return
        }

        if (!cart.items || cart.items.length === 0) {
          setError('No items in cart')
          return
        }

        // Calculate order value
        const orderValue = cart.items.reduce((total, item) => {
          const price = Number(item.product.salePrice)
          const finalPrice = !isNaN(price) && price > 0 ? price : Number(item.product.regularPrice || 0)

          return total + finalPrice * item.quantity
        }, 0)

        // Prepare items for shipping calculation
        const items = cart.items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.regularPrice,
          weight: item.product.weight || 0,
          categoryIds: item.product.category ? [item.product.category] : [],
        }))

        // Prepare shipping address
        const shippingAddress = {
          country: checkoutData.shipping.country,
          state: checkoutData.shipping.state,
          city: checkoutData.shipping.city,
          postalCode: checkoutData.shipping.zipCode,
        }

        await onCalculateShippingOptions({
          items,
          shippingAddress,
          orderValue,
          isHoliday: false,
        })
      } catch (err) {
        console.error('Shipping calculation error:', err)
        setError('Failed to load shipping options. Please try again.')
      }
    }

    // Only call if we don't have shipping options yet and haven't already tried loading
    if (shippingOptions.length === 0 && !isCalculatingShipping && !hasTriedLoading) {
      loadShippingOptions()
    }
  }, [
    shippingOptions.length,
    isCalculatingShipping,
    hasTriedLoading,
    onCalculateShippingOptions,
    cart.items,
    checkoutData.shipping,
  ])

  // Mark as tried loading if we already have shipping options (from initiate checkout)
  useEffect(() => {
    if (shippingOptions.length > 0 && !hasTriedLoading) {
      setHasTriedLoading(true)
    }
  }, [shippingOptions.length, hasTriedLoading])

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
      // Error is already handled by the parent component (CheckoutPage)
      // which will show the error modal, so we just need to set a local error
      console.error('Checkout initiation failed:', err)
      setError('Please check the error details and try again.')
    }
  }

  const handleBack = () => {
    onStepChange('billing')
  }

  // Show loading state while fetching shipping options
  if (isCalculatingShipping || (shippingOptions.length === 0 && !hasTriedLoading)) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='mb-4 text-xl font-semibold'>Select Shipping Method</h2>
          <p className='mb-6 text-gray-600'>Choose how you would like your order to be delivered.</p>
        </div>

        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='h-4 w-4 rounded-full bg-gray-200'></div>
                  <div className='space-y-2'>
                    <div className='h-4 w-32 rounded bg-gray-200'></div>
                    <div className='h-3 w-24 rounded bg-gray-200'></div>
                    <div className='h-3 w-28 rounded bg-gray-200'></div>
                  </div>
                </div>
                <div className='h-6 w-16 rounded bg-gray-200'></div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between pt-6'>
          <Button type='button' onClick={handleBack} label='Back'>
            Back
          </Button>
          <Button type='button' disabled label='Loading...'>
            Loading...
          </Button>
        </div>
      </div>
    )
  }

  // Show error state if loading failed
  if (shippingOptions.length === 0 && hasTriedLoading && !isCalculatingShipping) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='mb-4 text-xl font-semibold'>Select Shipping Method</h2>
          <p className='mb-6 text-gray-600'>Choose how you would like your order to be delivered.</p>
        </div>

        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <div className='text-center'>
            <p className='text-red-600'>Failed to load shipping options.</p>
            <p className='mt-1 text-sm text-red-500'>Please check your shipping address and try again.</p>
            <Button
              type='button'
              onClick={async () => {
                setHasTriedLoading(false)
                setError('')
                try {
                  // Check if we have the required data
                  if (
                    !checkoutData.shipping.firstName ||
                    !checkoutData.shipping.address ||
                    !checkoutData.shipping.city
                  ) {
                    setError('Please complete shipping address first')
                    return
                  }

                  if (!cart.items || cart.items.length === 0) {
                    setError('No items in cart')
                    return
                  }

                  // Calculate order value
                  const orderValue = cart.items.reduce((total, item) => {
                    const price = item.product.salePrice || item.product.regularPrice
                    return total + price * item.quantity
                  }, 0)

                  // Prepare items for shipping calculation
                  const items = cart.items.map((item) => ({
                    id: item.id,
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.salePrice || item.product.regularPrice,
                    weight: item.product.weight || 0,
                    categoryIds: item.product.category ? [item.product.category] : [],
                  }))

                  // Prepare shipping address
                  const shippingAddress = {
                    country: checkoutData.shipping.country,
                    state: checkoutData.shipping.state,
                    city: checkoutData.shipping.city,
                    postalCode: checkoutData.shipping.zipCode,
                  }

                  await onCalculateShippingOptions({
                    items,
                    shippingAddress,
                    orderValue,
                    isHoliday: false,
                  })
                } catch (err) {
                  setError('Failed to load shipping options. Please try again.')
                }
              }}
              label='Try Again'
              className='mt-2'
            >
              Try Again
            </Button>
          </div>
        </div>

        <div className='flex justify-between pt-6'>
          <Button type='button' onClick={handleBack} label='Back'>
            Back
          </Button>
          <Button type='button' disabled label='Continue to Payment'>
            Continue to Payment
          </Button>
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
        {shippingOptions.map((option: ShippingOption) => (
          <div
            key={option.id}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedOption?.id === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
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
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium'>{option.name}</h3>
                        <p className='text-sm text-gray-600'>{option.description}</p>
                        <p className='text-sm text-gray-500'>
                          Estimated delivery: {option.estimatedDays} day{option.estimatedDays !== 1 ? 's' : ''}
                        </p>
                        {option.rateType && (
                          <p className='text-xs capitalize text-gray-400'>
                            Rate type: {option.rateType.replace('_', ' ')}
                          </p>
                        )}
                        {option.requiresSignature && (
                          <p className='text-sm font-medium text-blue-600'>✓ Signature Required</p>
                        )}
                        {option.isInsured && (
                          <p className='text-sm font-medium text-green-600'>
                            ✓ Insured {option.insuranceAmount ? `($${option.insuranceAmount})` : ''}
                          </p>
                        )}
                        {option.guaranteedDelivery && (
                          <p className='text-sm font-medium text-green-600'>✓ Guaranteed Delivery</p>
                        )}
                        {option.isDefault && <p className='text-sm font-medium text-orange-600'>✓ Default Method</p>}
                      </div>
                    </div>

                    {/* Show breakdown if available */}
                    {option.breakdown && (
                      <div className='mt-2 space-y-1 text-xs text-gray-500'>
                        <div className='flex justify-between'>
                          <span>Base Rate:</span>
                          <span>${option.breakdown.baseRate.toFixed(2)}</span>
                        </div>
                        {option.breakdown.additionalCost > 0 && (
                          <div className='flex justify-between'>
                            <span>Additional Cost:</span>
                            <span>${option.breakdown.additionalCost.toFixed(2)}</span>
                          </div>
                        )}
                        {option.breakdown.handlingFee > 0 && (
                          <div className='flex justify-between'>
                            <span>Handling Fee:</span>
                            <span>${option.breakdown.handlingFee.toFixed(2)}</span>
                          </div>
                        )}
                        {option.breakdown.insuranceFee > 0 && (
                          <div className='flex justify-between'>
                            <span>Insurance Fee:</span>
                            <span>${option.breakdown.insuranceFee.toFixed(2)}</span>
                          </div>
                        )}
                        {option.breakdown.signatureFee > 0 && (
                          <div className='flex justify-between'>
                            <span>Signature Fee:</span>
                            <span>${option.breakdown.signatureFee.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {option.breakdown && (
                <div className='text-right'>
                  <p className='text-lg font-semibold'>
                    ${(option.breakdown.baseRate + option.breakdown.additionalCost).toFixed(2)}
                  </p>
                </div>
              )}
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
          disabled={!selectedOption || isCalculatingShipping || isInitiating || isSavingAddress}
        >
          {isInitiating ? 'Initiating...' : isSavingAddress ? 'Saving Address...' : 'Continue to Payment'}
        </Button>
      </div>
    </div>
  )
}
