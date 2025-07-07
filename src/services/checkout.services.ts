import type { ApiResBodyBase } from '@/types/api'

// Types for checkout workflow
export interface InitiateCheckoutPayload {
  shippingAddressId: string
  billingAddressId: string
  shippingMethod: string
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
  checkoutType: 'guest' | 'registered'
}

export interface InitiateCheckoutResponse {
  checkoutId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  expiresAt: string
}

export interface CalculateShippingPayload {
  shippingAddressId: string
  shippingMethod: string
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  carrier: string
  serviceCode: string
  trackingAvailable: boolean
  guaranteedDelivery?: boolean
}

export interface CalculateShippingResponse {
  shippingMethods: ShippingOption[]
  defaultMethod: string
}



export interface PaymentDetails {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

export interface ConfirmOrderPayload {
  checkoutId: string
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
  paymentDetails?: PaymentDetails
  billingAddressId: string
  shippingAddressId: string
  shippingMethod: string
  notes?: string
}

export interface ConfirmOrderResponse {
  orderId: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  trackingNumber?: string
  estimatedDeliveryDate?: string
  totalAmount: number
}

// API Functions
export const initiateCheckout = async (
  payload: InitiateCheckoutPayload,
): Promise<ApiResBodyBase<InitiateCheckoutResponse>> => {
  const response = await fetch('/api/v1/checkout/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to initiate checkout')
  }

  return response.json()
}

export const calculateShipping = async (
  payload: CalculateShippingPayload,
): Promise<ApiResBodyBase<CalculateShippingResponse>> => {
  const response = await fetch('/api/v1/checkout/calculate-shipping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to calculate shipping')
  }

  return response.json()
}

export const confirmOrder = async (payload: ConfirmOrderPayload): Promise<ApiResBodyBase<ConfirmOrderResponse>> => {
  const response = await fetch('/api/v1/checkout/confirm-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to confirm order')
  }

  return response.json()
}
