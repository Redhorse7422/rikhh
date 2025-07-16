// Coupon enums
export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  USED_UP = 'used_up',
}

// Remove CouponUsageType and CouponApplicability enums as they're not used in backend

// Core coupon interface
export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  isActive: boolean
  validFrom: string
  validUntil: string
  usageLimit: number | null
  usageCount: number
  minimumAmount: number | null
  maximumDiscount: number | null
  description: string | null
  applicableProducts?: string[]
  applicableCategories?: string[]
  createdAt: string
  updatedAt: string
}

// Coupon usage tracking
export interface CouponUsage {
  id: string
  couponId: string
  userId: string
  orderId: string
  discountAmount: number
  usedAt: string
}

// Coupon statistics
export interface CouponStats {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  totalUsage: number
  totalDiscountGiven: number
  topCoupons: Array<{
    id: string
    code: string
    usageCount: number
    totalDiscount: number
  }>
}

// Create coupon data (for forms)
export interface CreateCouponData {
  code: string
  type: CouponType
  value: number
  isActive?: boolean
  startDate: string
  endDate: string
  usageLimit?: number
  minimumAmount?: number
  maximumDiscount?: number
  description?: string
  applicableProducts?: string[]
  applicableCategories?: string[]
}

// Update coupon data
export interface UpdateCouponData extends Partial<CreateCouponData> {
  id: string
}

// Bulk create coupon data
export interface BulkCreateCouponData {
  coupons: CreateCouponData[]
}

// Filter values for coupon list
export interface CouponFilterValues {
  search?: string
  type?: CouponType | ''
  status?: CouponStatus | ''
  isActive?: boolean | undefined
  validFrom?: string
  validUntil?: string
  sortBy?: 'code' | 'type' | 'value' | 'validFrom' | 'validUntil' | 'usageCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Coupon validation request/response
export interface CouponValidationRequest {
  code: string
  cartTotal: number
  productIds?: string[]
  categoryIds?: string[]
}

export interface CouponValidationResponse {
  valid: boolean
  coupon?: Coupon
  discountAmount?: number
  message?: string
}

// Cart coupon validation types
export interface CartCouponValidationRequest {
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
}

export interface CartCouponValidationResponse {
  isValid: boolean
  coupon?: {
    id: string
    code: string
    name: string
    type: CouponType
    value: number
    minimumAmount?: number
    maximumDiscount?: number
  }
  discountAmount: number
  message: string
}

// Checkout coupon application types
export interface CheckoutCouponApplicationRequest {
  checkoutId: string
  couponCode: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

export interface CheckoutCouponApplicationResponse {
  success: boolean
  data: {
    couponApplied: boolean
    coupon: {
      code: string
      name: string
      type: CouponType
      value: number
      discountAmount: number
    }
    updatedSummary: {
      subtotal: number
      taxAmount: number
      shippingAmount: number
      discountAmount: number
      totalAmount: number
    }
  }
}

// Applied coupon state for UI
export interface AppliedCoupon {
  code: string
  name?: string
  type: CouponType
  value: number
  discountAmount: number
  appliedAt: string
}

// API response types
export interface CouponListResponse {
  success: boolean
  data: {
    coupons: Coupon[]
    total: number
    page: number
    limit: number
  }
  message?: string
}

export interface CouponResponse {
  success: boolean
  data: Coupon
  message?: string
}

export interface CouponStatsResponse {
  success: boolean
  data: CouponStats
  message?: string
}

export interface CouponValidationApiResponse {
  success: boolean
  data: CouponValidationResponse
  message?: string
}

// Error response
export interface CouponErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}
