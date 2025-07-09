'use client'

import type { CheckoutStep, CheckoutData } from '../index'
import type { ShippingOption } from '@/services/checkout.services'

import type { ReactNode } from 'react'
import React, { createContext, useContext } from 'react'

interface CheckoutContextType {
  currentStep: CheckoutStep
  checkoutData: CheckoutData
  isProcessing: boolean
  checkoutId: string | null
  shippingOptions: ShippingOption[]
  selectedShippingOption: ShippingOption | null
  selectedShippingAddressId: string | null
  selectedBillingAddressId: string | null
  orderResponse: any
  isGuestMode: boolean
  isInitiating: boolean
  isCalculatingShipping: boolean
  isConfirming: boolean
  isSavingAddress: boolean
  onStepChange: (step: CheckoutStep) => void
  onDataUpdate: <K extends keyof CheckoutData>(section: K, data: Partial<CheckoutData[K]>) => void
  onCompleteOrder: () => Promise<void>
  onInitiateCheckout: () => Promise<void>
  onCalculateShipping: () => Promise<void>
  onSelectShippingAddress: (addressId: string) => void
  onSelectBillingAddress: (addressId: string) => void
  onSelectShippingOption: (option: ShippingOption) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface CheckoutProviderProps {
  children: ReactNode
  currentStep: CheckoutStep
  checkoutData: CheckoutData
  isProcessing: boolean
  checkoutId: string | null
  shippingOptions: ShippingOption[]
  selectedShippingOption: ShippingOption | null
  selectedShippingAddressId: string | null
  selectedBillingAddressId: string | null
  orderResponse: any
  isGuestMode: boolean
  isInitiating: boolean
  isCalculatingShipping: boolean
  isConfirming: boolean
  isSavingAddress: boolean
  onStepChange: (step: CheckoutStep) => void
  onDataUpdate: <K extends keyof CheckoutData>(section: K, data: Partial<CheckoutData[K]>) => void
  onCompleteOrder: () => Promise<void>
  onInitiateCheckout: () => Promise<void>
  onCalculateShipping: () => Promise<void>
  onSelectShippingAddress: (addressId: string) => void
  onSelectBillingAddress: (addressId: string) => void
  onSelectShippingOption: (option: ShippingOption) => void
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({
  children,
  currentStep,
  checkoutData,
  isProcessing,
  checkoutId,
  shippingOptions,
  selectedShippingOption,
  selectedShippingAddressId,
  selectedBillingAddressId,
  orderResponse,
  isGuestMode,
  isInitiating,
  isCalculatingShipping,
  isConfirming,
  isSavingAddress,
  onStepChange,
  onDataUpdate,
  onCompleteOrder,
  onInitiateCheckout,
  onCalculateShipping,
  onSelectShippingAddress,
  onSelectBillingAddress,
  onSelectShippingOption,
}) => {
  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        checkoutData,
        isProcessing,
        checkoutId,
        shippingOptions,
        selectedShippingOption,
        selectedShippingAddressId,
        selectedBillingAddressId,
        orderResponse,
        isGuestMode,
        isInitiating,
        isCalculatingShipping,
        isConfirming,
        isSavingAddress,
        onStepChange,
        onDataUpdate,
        onCompleteOrder,
        onInitiateCheckout,
        onCalculateShipping,
        onSelectShippingAddress,
        onSelectBillingAddress,
        onSelectShippingOption,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}
