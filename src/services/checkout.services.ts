import type { ApiResBodyBase } from '@/types/api'

// Types for checkout workflow
export interface InitiateCheckoutPayload {
  checkoutType: 'guest' | 'registered'
  // For authenticated users
  userId?: string
  shippingAddressId?: string
  // For guest users
  guestId?: string
  shippingAddress?: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    email: string
  }
  // Common fields
  shippingMethod: string
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
  billingAddressId?: string
}

export interface InitiateCheckoutResponse {
  checkoutId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  expiresAt: string
  availableShippingMethods?: ShippingOption[]
  availablePaymentMethods?: string[]
  summary?: {
    subtotal: number
    taxAmount: number
    shippingAmount: number
    discountAmount: number
    totalAmount: number
    itemCount: number
    items: Array<{
      id: string
      productId: string
      productName: string
      productSlug: string
      quantity: number
      unitPrice: string
      totalPrice: number
      selectedVariants: any[]
      thumbnailImage: string
    }>
  }
  items?: any[]
  shippingAddress?: any
  billingAddress?: any
}

export interface CalculateShippingPayload {
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  items: Array<{
    id: string
    productId: string
    quantity: number
    unitPrice: number
    selectedVariants?: Array<{
      attributeId: string
      attributeValueId: string
      attributeName: string
      attributeValue: string
    }>
  }>
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
  isDefault?: boolean
  breakdown?: {
    baseRate: number
    additionalCost: number
    handlingFee: number
    insuranceFee: number
    signatureFee: number
  }
  rateType?: string
  baseRate?: number
  additionalCost?: number
  methodSlug?: string
  rateId?: string
  rateName?: string
  requiresSignature?: boolean
  isInsured?: boolean
  insuranceAmount?: number | null
}

export interface CalculateShippingResponse {
  shippingMethods: ShippingOption[]
  defaultMethod: string
}

export interface CalculateTaxPayload {
  checkoutId: string
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface ApplyCouponPayload {
  checkoutId: string
  couponCode: string
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
  guestId?: string
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
  paymentData?: PaymentDetails
  notes?: string
}

export interface ConfirmOrderResponse {
  orderId: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  trackingNumber?: string
  estimatedDeliveryDate?: string
  totalAmount: number
}

// Guest Order Types
export interface GuestOrder {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  paymentStatus: string
  paymentMethod: string
  paymentTransactionId: string
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  customerPhone: string
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
    selectedVariants: Array<{
      attributeId: string
      attributeValueId: string
      attributeName: string
      attributeValue: string
    }>
  }>
  createdAt: string
  updatedAt: string
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
  const response = await fetch('/api/v1/checkout/calculate-shipping-preview', {
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

export const calculateTax = async (payload: CalculateTaxPayload): Promise<ApiResBodyBase<{ taxAmount: number }>> => {
  const response = await fetch('/api/v1/checkout/calculate-tax', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to calculate tax')
  }

  return response.json()
}

export const applyCoupon = async (
  payload: ApplyCouponPayload,
): Promise<ApiResBodyBase<{ discountAmount: number; couponCode: string }>> => {
  const response = await fetch('/api/v1/checkout/apply-coupon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to apply coupon')
  }

  return response.json()
}

// Save address to checkout session (for guest checkout)
export interface SaveCheckoutAddressPayload {
  checkoutId: string
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    email: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    email: string
  }
  billingAddressSameAsShipping: boolean
}

export const saveCheckoutAddress = async (payload: SaveCheckoutAddressPayload): Promise<ApiResBodyBase<void>> => {
  const response = await fetch('/api/v1/checkout/address', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to save checkout address')
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

// Guest Order Functions
export const getGuestOrders = async (guestId: string): Promise<ApiResBodyBase<GuestOrder[]>> => {
  const response = await fetch(`/api/v1/checkout/orders?guestId=${guestId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to get guest orders')
  }

  return response.json()
}

export const getGuestOrderById = async (orderId: string, guestId: string): Promise<ApiResBodyBase<GuestOrder>> => {
  const response = await fetch(`/api/v1/checkout/orders/${orderId}?guestId=${guestId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to get guest order')
  }

  return response.json()
}
