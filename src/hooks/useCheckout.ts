import { useState, useEffect } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { getGuestId } from '@/services/cart.guest'
import {
  initiateCheckout,
  calculateShipping,
  calculateTax,
  applyCoupon,
  confirmOrder,
  getGuestOrders,
  getGuestOrderById,
  saveCheckoutAddress,
  type InitiateCheckoutPayload,
  type CalculateShippingPayload,
  type CalculateTaxPayload,
  type ApplyCouponPayload,
  type ConfirmOrderPayload,
  type SaveCheckoutAddressPayload,
  type GuestOrder,
} from '@/services/checkout.services'

// Helper functions for managing checkoutId in localStorage
const CHECKOUT_ID_KEY = 'checkout_id'

const getStoredCheckoutId = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(CHECKOUT_ID_KEY)
  } catch (error) {
    return null
  }
}

const setStoredCheckoutId = (checkoutId: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CHECKOUT_ID_KEY, checkoutId)
  } catch (error) {
    // Silently handle localStorage errors
  }
}

const removeStoredCheckoutId = (): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(CHECKOUT_ID_KEY)
  } catch (error) {
    // Silently handle localStorage errors
  }
}

export const useCheckout = () => {
  const { data: session } = useSession()
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null)
  const [taxAmount, setTaxAmount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)

  const isGuest = !session?.user

  // Initialize checkoutId from localStorage on mount
  useEffect(() => {
    const storedCheckoutId = getStoredCheckoutId()
    if (storedCheckoutId) {
      setCheckoutId(storedCheckoutId)
    }
  }, [])

  // Add a function to validate if the current checkoutId is still valid
  const validateCheckoutId = async () => {
    if (!checkoutId) return false
    // You could add an API call here to validate the checkoutId with the backend
    // For now, we'll assume it's valid if it exists
    return true
  }

  // Helper function to update checkoutId in both state and localStorage
  const updateCheckoutId = (newCheckoutId: string | null) => {
    setCheckoutId(newCheckoutId)
    if (newCheckoutId) {
      setStoredCheckoutId(newCheckoutId)
    } else {
      removeStoredCheckoutId()
    }
  }

  const initiateCheckoutMutation = useMutation({
    mutationFn: async (payload: Omit<InitiateCheckoutPayload, 'checkoutType' | 'guestId'>) => {
      const guestId = isGuest ? getGuestId() : undefined
      const fullPayload: InitiateCheckoutPayload = {
        ...payload,
        checkoutType: isGuest ? 'guest' : 'registered',
        ...(isGuest && guestId && { guestId }),
      }
      const result = await initiateCheckout(fullPayload)
      return result
    },
    onSuccess: (data) => {
      // Handle both response formats: {code: 0, data: ...} and {success: true, data: ...}
      if (data.code === 0) {
        updateCheckoutId(data.data.checkoutId)
        // Set shipping options if available
        if (data.data.availableShippingMethods) {
          setShippingOptions(data.data.availableShippingMethods)
          // Set default shipping option if available
          const defaultOption = data.data.availableShippingMethods[0]
          if (defaultOption) {
            setSelectedShippingOption(defaultOption)
          }
        }
      } else if ('success' in data && data.success && 'data' in data) {
        const successData = data as any
        updateCheckoutId(successData.data.checkoutId)
        // Set shipping options if available
        if (successData.data.availableShippingMethods) {
          setShippingOptions(successData.data.availableShippingMethods)
          // Set default shipping option if available
          const defaultOption = successData.data.availableShippingMethods[0]
          if (defaultOption) {
            setSelectedShippingOption(defaultOption)
          }
        }
      }
    },
  })

  const calculateShippingMutation = useMutation({
    mutationFn: async (payload: Omit<CalculateShippingPayload, 'checkoutId'>) => {
      const fullPayload: CalculateShippingPayload = {
        ...payload,
      }
      const result = await calculateShipping(fullPayload)
      return result
    },
    onSuccess: (data) => {
      if (data.code === 0) {
        setShippingOptions(data.data.shippingMethods)
        // Set default shipping option
        const defaultOption = data.data.shippingMethods.find((option: any) => option.id === data.data.defaultMethod)
        if (defaultOption) {
          setSelectedShippingOption(defaultOption)
        }
      } else if ('success' in data && data.success && 'data' in data) {
        const successData = data as any
        setShippingOptions(successData.data.shippingMethods)
        // Set default shipping option
        const defaultOption = successData.data.shippingMethods.find(
          (option: any) => option.id === successData.data.defaultMethod,
        )
        if (defaultOption) {
          setSelectedShippingOption(defaultOption)
        }
      }
    },
  })

  const calculateTaxMutation = useMutation({
    mutationFn: async (payload: Omit<CalculateTaxPayload, 'checkoutId'>) => {
      if (!checkoutId) throw new Error('Checkout ID is required')
      const fullPayload: CalculateTaxPayload = {
        ...payload,
        checkoutId,
      }
      const result = await calculateTax(fullPayload)
      return result
    },
    onSuccess: (data) => {
      if (data.code === 0) {
        setTaxAmount(data.data.taxAmount)
      } else if ('success' in data && data.success && 'data' in data) {
        const successData = data as any
        setTaxAmount(successData.data.taxAmount)
      }
    },
  })

  const applyCouponMutation = useMutation({
    mutationFn: async (payload: Omit<ApplyCouponPayload, 'checkoutId'>) => {
      if (!checkoutId) throw new Error('Checkout ID is required')
      const fullPayload: ApplyCouponPayload = {
        ...payload,
        checkoutId,
      }
      const result = await applyCoupon(fullPayload)
      return result
    },
    onSuccess: (data) => {
      if (data.code === 0) {
        setDiscountAmount(data.data.discountAmount)
      } else if ('success' in data && data.success && 'data' in data) {
        const successData = data as any
        setDiscountAmount(successData.data.discountAmount)
      }
    },
  })

  const confirmOrderMutation = useMutation({
    mutationFn: async (payload: Omit<ConfirmOrderPayload, 'checkoutId' | 'guestId'>) => {
      if (!checkoutId) throw new Error('Checkout ID is required')
      const guestId = isGuest ? getGuestId() : undefined
      const fullPayload: ConfirmOrderPayload = {
        ...payload,
        checkoutId,
        ...(isGuest && guestId && { guestId }),
      }
      const result = await confirmOrder(fullPayload)
      return result
    },
    onSuccess: (data) => {
      // Clear the checkout session after successful order confirmation
      updateCheckoutId(null)
    },
  })

  const getGuestOrdersMutation = useMutation({
    mutationFn: async () => {
      const guestId = getGuestId()
      if (!guestId) throw new Error('Guest ID is required')
      const result = await getGuestOrders(guestId)
      return result
    },
  })

  const getGuestOrderByIdMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const guestId = getGuestId()
      if (!guestId) throw new Error('Guest ID is required')
      const result = await getGuestOrderById(orderId, guestId)
      return result
    },
  })

  const saveCheckoutAddressMutation = useMutation({
    mutationFn: async (payload: SaveCheckoutAddressPayload) => {
      const result = await saveCheckoutAddress(payload)
      return result
    },
  })

  const handleInitiateCheckout = async (payload: Omit<InitiateCheckoutPayload, 'checkoutType' | 'guestId'>) => {
    try {
      const result = await initiateCheckoutMutation.mutateAsync(payload)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleCalculateShipping = async (payload: Omit<CalculateShippingPayload, 'checkoutId'>) => {
    try {
      const result = await calculateShippingMutation.mutateAsync(payload)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleCalculateTax = async (payload: Omit<CalculateTaxPayload, 'checkoutId'>) => {
    try {
      const result = await calculateTaxMutation.mutateAsync(payload)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleApplyCoupon = async (payload: Omit<ApplyCouponPayload, 'checkoutId'>) => {
    try {
      const result = await applyCouponMutation.mutateAsync(payload)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleConfirmOrder = async (payload: Omit<ConfirmOrderPayload, 'checkoutId' | 'guestId'>) => {
    try {
      const result = await confirmOrderMutation.mutateAsync(payload)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleGetGuestOrders = async () => {
    try {
      const result = await getGuestOrdersMutation.mutateAsync()
      return result
    } catch (error) {
      throw error
    }
  }

  const handleGetGuestOrderById = async (orderId: string) => {
    try {
      const result = await getGuestOrderByIdMutation.mutateAsync(orderId)
      return result
    } catch (error) {
      throw error
    }
  }

  const handleSaveCheckoutAddress = async (payload: Omit<SaveCheckoutAddressPayload, 'checkoutId'>) => {
    try {
      if (!checkoutId) throw new Error('Checkout ID is required')
      const fullPayload: SaveCheckoutAddressPayload = {
        ...payload,
        checkoutId,
      }
      const result = await saveCheckoutAddressMutation.mutateAsync(fullPayload)
      return result
    } catch (error) {
      throw error
    }
  }

  const resetCheckout = () => {
    updateCheckoutId(null)
    setShippingOptions([])
    setSelectedShippingOption(null)
    setTaxAmount(0)
    setDiscountAmount(0)
  }

  return {
    // State
    checkoutId,
    shippingOptions,
    selectedShippingOption,
    taxAmount,
    discountAmount,
    isGuest,

    // Loading states
    isInitiating: initiateCheckoutMutation.isPending,
    isCalculatingShipping: calculateShippingMutation.isPending,
    isCalculatingTax: calculateTaxMutation.isPending,
    isApplyingCoupon: applyCouponMutation.isPending,
    isConfirming: confirmOrderMutation.isPending,
    isLoadingGuestOrders: getGuestOrdersMutation.isPending,
    isLoadingGuestOrder: getGuestOrderByIdMutation.isPending,
    isSavingAddress: saveCheckoutAddressMutation.isPending,

    // Error states
    initiateError: initiateCheckoutMutation.error,
    shippingError: calculateShippingMutation.error,
    taxError: calculateTaxMutation.error,
    couponError: applyCouponMutation.error,
    confirmError: confirmOrderMutation.error,
    guestOrdersError: getGuestOrdersMutation.error,
    guestOrderError: getGuestOrderByIdMutation.error,
    saveAddressError: saveCheckoutAddressMutation.error,

    // Actions
    initiateCheckout: handleInitiateCheckout,
    calculateShipping: handleCalculateShipping,
    calculateTax: handleCalculateTax,
    applyCoupon: handleApplyCoupon,
    confirmOrder: handleConfirmOrder,
    getGuestOrders: handleGetGuestOrders,
    getGuestOrderById: handleGetGuestOrderById,
    saveCheckoutAddress: handleSaveCheckoutAddress,
    resetCheckout,

    // Debug utilities
    getStoredCheckoutId,
    clearStoredCheckoutId: () => updateCheckoutId(null),

    // Mutations (for direct access if needed)
    initiateCheckoutMutation,
    calculateShippingMutation,
    calculateTaxMutation,
    applyCouponMutation,
    confirmOrderMutation,
    getGuestOrdersMutation,
    getGuestOrderByIdMutation,
    saveCheckoutAddressMutation,
  }
}
