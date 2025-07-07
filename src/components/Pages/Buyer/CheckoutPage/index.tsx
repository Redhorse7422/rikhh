'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useCart } from '@/contexts/CartContext'
import { useAddresses } from '@/hooks/useAddresses'
import { useCheckout } from '@/hooks/useCheckout'

import { CheckoutProgress } from './components/CheckoutProgress'
import { CheckoutSteps } from './components/CheckoutSteps'
import { CheckoutSummary } from './components/CheckoutSummary'
import { CheckoutProvider } from './context/CheckoutContext'

export type CheckoutStep = 'shipping' | 'billing' | 'shipping-method' | 'payment' | 'review' | 'confirmation'

export interface CheckoutData {
  shipping: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billing: {
    sameAsShipping: boolean
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  payment: {
    method: 'card' | 'paypal' | 'apple-pay' | 'google-pay'
    cardNumber: string
    cardHolderName: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    saveCard: boolean
  }
  orderNotes: string
  termsAccepted: boolean
  marketingConsent: boolean
}

const initialCheckoutData: CheckoutData = {
  shipping: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  billing: {
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  payment: {
    method: 'card',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false,
  },
  orderNotes: '',
  termsAccepted: false,
  marketingConsent: false,
}

export const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { cart, fetchCart } = useCart()
  const { addresses, getDefaultShippingAddress, getDefaultBillingAddress } = useAddresses()
  const {
    checkoutId,
    shippingOptions,
    selectedShippingOption,
    initiateCheckout,
    calculateShipping,
    confirmOrder,
    isInitiating,
    isCalculatingShipping,
    isConfirming,
  } = useCheckout()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string | null>(null)
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.isLoading && cart.items.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step)
  }

  const handleDataUpdate = <K extends keyof CheckoutData>(section: K, data: Partial<CheckoutData[K]>) => {
    setCheckoutData((prev) => {
      const currentSection = prev[section]
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: { ...currentSection, ...data },
        }
      }
      return {
        ...prev,
        [section]: data,
      }
    })
  }

  const handleInitiateCheckout = async () => {
    // For now, we'll use placeholder IDs for manually entered addresses
    // In a real implementation, you might want to create temporary addresses or handle this differently
    const shippingAddressId = selectedShippingAddressId || 'temp-shipping-address'
    const billingAddressId = selectedBillingAddressId || 'temp-billing-address'

    if (!shippingAddressId || !billingAddressId) {
      console.error('Shipping and billing addresses must be provided')
      return
    }

    try {
      await initiateCheckout({
        shippingAddressId,
        billingAddressId,
        shippingMethod: selectedShippingOption?.serviceCode || 'standard',
        paymentMethod:
          checkoutData.payment.method === 'card'
            ? 'credit_card'
            : checkoutData.payment.method === 'apple-pay'
              ? 'apple_pay'
              : checkoutData.payment.method === 'google-pay'
                ? 'google_pay'
                : checkoutData.payment.method,
        checkoutType: 'registered',
      })
    } catch (error) {
      console.error('Failed to initiate checkout:', error)
    }
  }

  const handleCalculateShipping = async () => {
    const shippingAddressId = selectedShippingAddressId || 'temp-shipping-address'

    if (!shippingAddressId) {
      console.error('Shipping address must be provided')
      return
    }

    try {
      console.log('Calculating shipping with:', {
        shippingAddressId,
        shippingMethod: selectedShippingOption?.serviceCode || 'standard',
      })

      const result = await calculateShipping({
        shippingAddressId,
        shippingMethod: selectedShippingOption?.serviceCode || 'standard',
      })
      console.log('Calculate shipping result:', result)
    } catch (error) {
      console.error('Failed to calculate shipping:', error)
      throw error
    }
  }

  const handleCompleteOrder = async () => {
    if (!checkoutId) {
      console.error('Checkout not initiated')
      return
    }

    setIsProcessing(true)
    try {
      const payload: any = {
        checkoutId,
        paymentMethod:
          checkoutData.payment.method === 'card'
            ? 'credit_card'
            : checkoutData.payment.method === 'apple-pay'
              ? 'apple_pay'
              : checkoutData.payment.method === 'google-pay'
                ? 'google_pay'
                : checkoutData.payment.method,
        // shippingMethod: selectedShippingOption?.method || 'standard',
        notes: checkoutData.orderNotes,
      }

      // Add payment details if using credit card
      if (checkoutData.payment.method === 'card') {
        payload.paymentData = {
          cardNumber: checkoutData.payment.cardNumber,
          expiryMonth: checkoutData.payment.expiryMonth,
          expiryYear: checkoutData.payment.expiryYear,
          cvv: checkoutData.payment.cvv,
          cardholderName: checkoutData.payment.cardHolderName,
        }
      }

      const result = await confirmOrder(payload)

      // Refresh cart to get updated state from backend
      // await fetchCart()
      
      // Move to confirmation step
      setCurrentStep('confirmation')
    } catch (error) {
      console.error('Error completing order:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-8 h-4 w-1/4 rounded bg-gray-200'></div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              <div className='space-y-4 lg:col-span-2'>
                <div className='h-32 rounded bg-gray-200'></div>
                <div className='h-32 rounded bg-gray-200'></div>
                <div className='h-32 rounded bg-gray-200'></div>
              </div>
              <div className='h-96 rounded bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return null // Will redirect to cart
  }

  return (
    <CheckoutProvider
      currentStep={currentStep}
      checkoutData={checkoutData}
      checkoutId={checkoutId}
      shippingOptions={shippingOptions}
      selectedShippingOption={selectedShippingOption}
      selectedShippingAddressId={selectedShippingAddressId}
      selectedBillingAddressId={selectedBillingAddressId}
      onStepChange={handleStepChange}
      onDataUpdate={handleDataUpdate}
      onCompleteOrder={handleCompleteOrder}
      onInitiateCheckout={handleInitiateCheckout}
      onCalculateShipping={handleCalculateShipping}
      onSelectShippingAddress={setSelectedShippingAddressId}
      onSelectBillingAddress={setSelectedBillingAddressId}
      onSelectShippingOption={(option) => {
        // This will be implemented when we add shipping method selection
        console.log('Selected shipping option:', option)
      }}
      isProcessing={isProcessing}
      isInitiating={isInitiating}
      isCalculatingShipping={isCalculatingShipping}
      isConfirming={isConfirming}
    >
      <div className='min-h-screen bg-gray-50'>
        {/* Breadcrumb */}
        <div className='border-b bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
            <Breadcrumb pageName='Checkout' />
          </div>
        </div>

        {/* Main Checkout Section */}
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Checkout Steps */}
            <div className='lg:col-span-2'>
              <CheckoutProgress currentStep={currentStep} />
              <CheckoutSteps />
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}
