import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import {
  initiateCheckout,
  calculateShipping,
  confirmOrder,
  type InitiateCheckoutPayload,
  type CalculateShippingPayload,
  type ConfirmOrderPayload,
  type InitiateCheckoutResponse,
  type CalculateShippingResponse,
  type ConfirmOrderResponse,
  type ShippingOption,
} from '@/services/checkout.services'

export const useCheckout = () => {
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null)

  // Step 1: Initiate Checkout
  const initiateCheckoutMutation = useMutation({
    mutationFn: initiateCheckout,
    onSuccess: (response) => {
      if (response && 'data' in response) {
        setCheckoutId(response.data.checkoutId)
      }
    },
  })

  // Step 2: Calculate Shipping
  const calculateShippingMutation = useMutation({
    mutationFn: calculateShipping,
    onSuccess: (response) => {
      if (response && 'data' in response) {
        setShippingOptions(response.data.shippingMethods)
        // Set default method as selected
        const defaultOption = response.data.shippingMethods.find(
          option => option.id === response.data.defaultMethod
        )
        setSelectedShippingOption(defaultOption || response.data.shippingMethods[0])
      }
    },
  })

  // Step 3: Confirm Order
  const confirmOrderMutation = useMutation({
    mutationFn: confirmOrder,
  })

  // Helper functions
  const handleInitiateCheckout = async (payload: InitiateCheckoutPayload) => {
    try {
      const result = await initiateCheckoutMutation.mutateAsync(payload)
      return result
    } catch (error) {
      console.error('Failed to initiate checkout:', error)
      throw error
    }
  }

  const handleCalculateShipping = async (payload: CalculateShippingPayload) => {
    try {
      const result = await calculateShippingMutation.mutateAsync(payload)
      return result
    } catch (error) {
      console.error('Failed to calculate shipping:', error)
      throw error
    }
  }

  const handleConfirmOrder = async (payload: ConfirmOrderPayload) => {
    try {
      const result = await confirmOrderMutation.mutateAsync(payload)
      return result
    } catch (error) {
      console.error('Failed to confirm order:', error)
      throw error
    }
  }

  const resetCheckout = () => {
    setCheckoutId(null)
    setShippingOptions([])
    setSelectedShippingOption(null)
  }

  return {
    // State
    checkoutId,
    shippingOptions,
    selectedShippingOption,

    // Loading states
    isInitiating: initiateCheckoutMutation.isPending,
    isCalculatingShipping: calculateShippingMutation.isPending,
    isConfirming: confirmOrderMutation.isPending,

    // Error states
    initiateError: initiateCheckoutMutation.error,
    shippingError: calculateShippingMutation.error,
    confirmError: confirmOrderMutation.error,

    // Actions
    initiateCheckout: handleInitiateCheckout,
    calculateShipping: handleCalculateShipping,
    confirmOrder: handleConfirmOrder,
    resetCheckout,

    // Mutations (for direct access if needed)
    initiateCheckoutMutation,
    calculateShippingMutation,
    confirmOrderMutation,
  }
}
