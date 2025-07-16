import type {
  Coupon,
  CouponFilterValues,
  CouponListResponse,
  CouponResponse,
  CouponStatsResponse,
  CreateCouponData,
  UpdateCouponData,
  BulkCreateCouponData,
  CouponValidationRequest,
  CouponValidationApiResponse,
} from '@/types/coupon'

import { client } from '@/libs/axios'
import { CouponType, CouponStatus } from '@/types/coupon'

// CRUD Operations
export const getCoupons = async (filters?: CouponFilterValues): Promise<CouponListResponse> => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.type) params.append('type', filters.type)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.isActive !== undefined && filters.isActive) {
    params.append('isActive', filters.isActive.toString())
  }
  if (filters?.validFrom) params.append('validFrom', filters.validFrom)
  if (filters?.validUntil) params.append('validUntil', filters.validUntil)
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

  const response = await client.get(`/coupons?${params.toString()}`)
  return response.data
}

export const getCoupon = async (id: string): Promise<CouponResponse> => {
  const response = await client.get(`/coupons/${id}`)
  return response.data
}

export const getCouponByCode = async (code: string) => {
  const response = await client.get(`/v1/coupons/code/${code}`)
  return response.data
}

export const createCoupon = async (data: CreateCouponData): Promise<CouponResponse> => {
  const response = await client.post('/coupons', data)
  return response.data
}

export const updateCoupon = async (id: string, data: UpdateCouponData): Promise<CouponResponse> => {
  const response = await client.put(`/coupons/${id}`, data)
  return response.data
}

export const deleteCoupon = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await client.delete(`/coupons/${id}`)
  return response.data
}

// Activation/Deactivation
export const activateCoupon = async (id: string): Promise<CouponResponse> => {
  const response = await client.patch(`/coupons/${id}/activate`)
  return response.data
}

export const deactivateCoupon = async (id: string): Promise<CouponResponse> => {
  const response = await client.patch(`/coupons/${id}/deactivate`)
  return response.data
}

// Statistics
export const getCouponStats = async (): Promise<CouponStatsResponse> => {
  const response = await client.get('/coupons/stats')
  return response.data
}

// Bulk Operations
export const bulkCreateCoupons = async (
  data: BulkCreateCouponData,
): Promise<{
  success: boolean
  data: {
    created: number
    failed: number
    errors?: Array<{ code: string; error: string }>
    coupons: Coupon[]
  }
  message: string
}> => {
  const response = await client.post('/coupons/bulk', data)
  return response.data
}

// Export to CSV
export const exportCouponsToCSV = async (filters?: CouponFilterValues): Promise<Blob> => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.type) params.append('type', filters.type)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.isActive !== undefined && filters.isActive) {
    params.append('isActive', filters.isActive.toString())
  }
  if (filters?.validFrom) params.append('validFrom', filters.validFrom)
  if (filters?.validUntil) params.append('validUntil', filters.validUntil)

  const response = await client.get(`/coupons/export?${params.toString()}`, {
    responseType: 'blob',
  })
  return response.data
}

// Public coupon validation
export const validateCoupon = async (data: CouponValidationRequest): Promise<CouponValidationApiResponse> => {
  const response = await client.post('/coupons/validate', data)
  return response.data
}

// Stage 1: Cart Coupon Validation (Preview)
export const validateCouponForCart = async (data: {
  couponCode: string
  items: Array<{
    productId: string
    categoryId: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  userId?: string
  guestId?: string
}) => {
  const response = await client.post('/v1/coupons/validate', data)
  return response
}

// Stage 2: Apply Coupon to Checkout Session
export const applyCouponToCheckout = async (data: {
  checkoutId: string
  couponCode: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}) => {
  const response = await client.post('/v1/checkout/apply-coupon', data)
  return response
}

// Remove coupon from checkout
export const removeCouponFromCheckout = async (checkoutId: string) => {
  const response = await client.delete(`/v1/checkout/remove-coupon/${checkoutId}`)
  return response.data
}

// Helper Functions
export const formatCouponValue = (coupon: Coupon): string => {
  switch (coupon.type) {
    case CouponType.PERCENTAGE:
      return `${coupon.value}%`
    case CouponType.FIXED_AMOUNT:
      return `$${Number(coupon.value).toFixed(2)}`
    case CouponType.FREE_SHIPPING:
      return 'Free Shipping'
    default:
      return String(coupon.value)
  }
}

export const getCouponStatusDisplayName = (status: CouponStatus): string => {
  switch (status) {
    case CouponStatus.ACTIVE:
      return 'Active'
    case CouponStatus.INACTIVE:
      return 'Inactive'
    case CouponStatus.EXPIRED:
      return 'Expired'
    case CouponStatus.USED_UP:
      return 'Used Up'
    default:
      return status
  }
}

export const getCouponTypeDisplayName = (type: CouponType): string => {
  switch (type) {
    case CouponType.PERCENTAGE:
      return 'Percentage'
    case CouponType.FIXED_AMOUNT:
      return 'Fixed Amount'
    case CouponType.FREE_SHIPPING:
      return 'Free Shipping'
    default:
      return type
  }
}

// CSV Export Helper
export const downloadCouponExport = async (filters?: CouponFilterValues): Promise<void> => {
  try {
    const blob = await exportCouponsToCSV(filters)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coupons-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading coupon export:', error)
    throw error
  }
}

// Validation Helpers
export const isCouponExpired = (coupon: Coupon): boolean => {
  return new Date(coupon.validUntil) < new Date()
}

export const isCouponActiveAndValid = (coupon: Coupon): boolean => {
  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validUntil = new Date(coupon.validUntil)

  return (
    coupon.isActive &&
    now >= validFrom &&
    now <= validUntil &&
    (coupon.usageLimit === null || coupon.usageCount < coupon.usageLimit)
  )
}

export const getCouponUsagePercentage = (coupon: Coupon): number => {
  if (coupon.usageLimit === null) return 0
  return Math.round((coupon.usageCount / coupon.usageLimit) * 100)
}
