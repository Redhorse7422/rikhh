'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useCart } from '@/contexts/CartContext'
import { useAddresses } from '@/hooks/useAddresses'
import { useCheckout } from '@/hooks/useCheckout'
import { createAddress } from '@/services/addresses.services'

import { CheckoutProgress } from './components/CheckoutProgress'
import { CheckoutSteps } from './components/CheckoutSteps'
import { CheckoutSummary } from './components/CheckoutSummary'
import { GuestCheckoutPrompt } from './components/GuestCheckoutPrompt'
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
  const { data: session } = useSession()
  const { cart, fetchCart } = useCart()
  const { addresses, getDefaultShippingAddress, getDefaultBillingAddress, isAuthenticated, refetch } = useAddresses()
  const {
    checkoutId,
    shippingOptions,
    selectedShippingOption,
    initiateCheckout,
    calculateShipping,
    confirmOrder,
    saveCheckoutAddress,
    isInitiating,
    isCalculatingShipping,
    isConfirming,
    isSavingAddress,
  } = useCheckout()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string | null>(null)
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null)
  const [orderResponse, setOrderResponse] = useState<any>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  
  // Determine if user is authenticated
  const isUserAuthenticated = !!(session?.user || isAuthenticated)
  
  // Determine if we should show the guest prompt
  const shouldShowGuestPrompt = !isUserAuthenticated && !isGuestMode

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.isLoading && cart.items.length === 0 && currentStep !== 'confirmation') {
      router.push('/cart')
    }
  }, [cart, router, currentStep])

  // Monitor checkoutId changes
  useEffect(() => {
    // CheckoutId monitoring for internal state management
  }, [checkoutId])

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step)
  }

  const handleDataUpdate = useCallback(<K extends keyof CheckoutData>(section: K, data: Partial<CheckoutData[K]>) => {
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
  }, [])

  const handleContinueAsGuest = () => {
    setIsGuestMode(true)
  }

  const onInitiateCheckout = async () => {
    try {
      
      const result = await initiateCheckout({
        shippingMethod: selectedShippingOption?.serviceCode || 'standard',
        paymentMethod:
          checkoutData.payment.method === 'card'
            ? 'credit_card'
            : checkoutData.payment.method === 'apple-pay'
              ? 'apple_pay'
              : checkoutData.payment.method === 'google-pay'
                ? 'google_pay'
                : checkoutData.payment.method,
        // For authenticated users, include address IDs
        ...(isAuthenticated && {
          shippingAddressId: selectedShippingAddressId || undefined,
          billingAddressId: selectedBillingAddressId || undefined,
        }),
      })
      
      // Extract checkoutId from the result based on response format
      let extractedCheckoutId: string | null = null
      if (result.code === 0) {
        extractedCheckoutId = result.data.checkoutId
      } else if ('success' in result && result.success && 'data' in result) {
        const successData = result as any
        extractedCheckoutId = successData.data.checkoutId
      }

      // For guest users, save address to checkout session after successful initiation
      if (isGuestMode && !isAuthenticated && extractedCheckoutId) {
        // Use the extracted checkoutId directly instead of relying on state
        const addressPayload = {
          checkoutId: extractedCheckoutId,
          shippingAddress: {
            firstName: checkoutData.shipping.firstName,
            lastName: checkoutData.shipping.lastName,
            addressLine1: checkoutData.shipping.address,
            city: checkoutData.shipping.city,
            state: checkoutData.shipping.state,
            postalCode: checkoutData.shipping.zipCode,
            country: checkoutData.shipping.country,
            phone: checkoutData.shipping.phone,
            email: checkoutData.shipping.email,
          },
          billingAddress: {
            firstName: checkoutData.billing.firstName,
            lastName: checkoutData.billing.lastName,
            addressLine1: checkoutData.billing.address,
            city: checkoutData.billing.city,
            state: checkoutData.billing.state,
            postalCode: checkoutData.billing.zipCode,
            country: checkoutData.billing.country,
            phone: checkoutData.billing.phone,
            email: checkoutData.billing.email,
          },
          billingAddressSameAsShipping: checkoutData.billing.sameAsShipping,
        }

        // Call the API directly instead of using the hook function
        const addressResult = await fetch('/api/v1/checkout/address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(addressPayload),
        })

        if (!addressResult.ok) {
          throw new Error('Failed to save checkout address')
        }
      }
    } catch (error) {
      throw error
    }
  }

  const handleCalculateShipping = async () => {
    // Check if we have shipping address data
    if (!checkoutData.shipping.firstName || !checkoutData.shipping.address || !checkoutData.shipping.city) {
      return
    }

    // Check if we have cart items
    if (!cart.items || cart.items.length === 0) {
      return
    }

    try {

      const result = await calculateShipping({
        shippingAddress: {
          firstName: checkoutData.shipping.firstName,
          lastName: checkoutData.shipping.lastName,
          addressLine1: checkoutData.shipping.address,
          city: checkoutData.shipping.city,
          state: checkoutData.shipping.state,
          postalCode: checkoutData.shipping.zipCode,
          country: checkoutData.shipping.country,
          phone: checkoutData.shipping.phone,
        },
        items: cart.items.map(item => ({
          id: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.salePrice || item.product.regularPrice,
          selectedVariants: item.selectedVariant ? [{
            attributeId: item.selectedVariant.id,
            attributeValueId: item.selectedVariant.id,
            attributeName: item.selectedVariant.name,
            attributeValue: item.selectedVariant.value,
          }] : [],
        })),
      })
    } catch (error) {
      throw error
    }
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true)
    try {
      const payload: any = {
        paymentMethod:
          checkoutData.payment.method === 'card'
            ? 'credit_card'
            : checkoutData.payment.method === 'apple-pay'
              ? 'apple_pay'
              : checkoutData.payment.method === 'google-pay'
                ? 'google_pay'
                : checkoutData.payment.method,
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

      // The confirmOrder function from useCheckout hook handles checkoutId validation internally
      const result = await confirmOrder(payload)
      
      // Store the order response data
      setOrderResponse(result)
      // Move to confirmation step
      setCurrentStep('confirmation')

      // Refresh cart after successful order
      await fetchCart()
    } catch (error) {
      // Don't throw - let the UI handle the error state
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
      orderResponse={orderResponse}
      isGuestMode={isGuestMode}
      onStepChange={handleStepChange}
      onDataUpdate={handleDataUpdate}
      onCompleteOrder={handleCompleteOrder}
      onInitiateCheckout={onInitiateCheckout}
      onCalculateShipping={handleCalculateShipping}
      onSelectShippingAddress={setSelectedShippingAddressId}
      onSelectBillingAddress={setSelectedBillingAddressId}
      onSelectShippingOption={(option) => {
        // Handle shipping option selection
      }}
      isProcessing={isProcessing}
      isInitiating={isInitiating}
      isCalculatingShipping={isCalculatingShipping}
      isConfirming={isConfirming}
      isSavingAddress={isSavingAddress}
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
          {/* Debug Panel - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className='mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200'>
              <h3 className='text-sm font-medium text-yellow-800'>Debug Info</h3>
              <div className='mt-2 text-sm text-yellow-700'>
                <p><strong>CheckoutId:</strong> {checkoutId || 'null'}</p>
                <p><strong>Current Step:</strong> {currentStep}</p>
                <p><strong>Guest Mode:</strong> {isGuestMode ? 'Yes' : 'No'}</p>
                <p><strong>Authenticated:</strong> {isUserAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>LocalStorage CheckoutId:</strong> {typeof window !== 'undefined' ? localStorage.getItem('checkout_id') || 'null' : 'SSR'}</p>
              </div>
            </div>
          )}

          {/* Guest Checkout Prompt - only show for unauthenticated users who haven't chosen guest mode */}
          {shouldShowGuestPrompt && <GuestCheckoutPrompt onContinueAsGuest={handleContinueAsGuest} />}

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
