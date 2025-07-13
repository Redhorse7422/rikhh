// Shipping Module Types

// Enums
export enum ZONE_TYPE {
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
  POSTAL_CODE = 'postal_code',
  CUSTOM = 'custom',
}

export enum METHOD_TYPE {
  FLAT_RATE = 'flat_rate',
  FREE_SHIPPING = 'free_shipping',
  WEIGHT_BASED = 'weight_based',
  PRICE_BASED = 'price_based',
  DISTANCE_BASED = 'distance_based',
}

export enum CARRIER_TYPE {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PREMIUM = 'premium',
  ECONOMY = 'economy',
  SAME_DAY = 'same_day',
  NEXT_DAY = 'next_day',
}

export enum RATE_TYPE {
  FLAT_RATE = 'flat_rate',
  WEIGHT_BASED = 'weight_based',
  PRICE_BASED = 'price_based',
  DISTANCE_BASED = 'distance_based',
  FREE = 'free',
  ITEM_BASED = 'item_based',
}

// Core Interfaces
export interface ShippingZone {
  id: string
  name: string
  slug: string
  description?: string
  zoneType: ZONE_TYPE
  countries?: string[]
  states?: string[]
  cities?: string[]
  postalCodes?: string[]
  isActive: boolean
  priority: number
  color?: string
  createdAt: Date
  updatedAt: Date
  methodsCount?: number
}

export interface ShippingMethod {
  id: string
  name: string
  slug: string
  description?: string
  methodType: METHOD_TYPE
  carrierType: CARRIER_TYPE
  zoneId?: string
  zone?: {
    id: string
    name: string
    slug: string
  }
  isActive: boolean
  priority: number
  estimatedDays?: number
  icon?: string
  color?: string
  isDefault: boolean
  requiresSignature: boolean
  isInsured: boolean
  insuranceAmount?: number
  createdAt: Date
  updatedAt: Date
  ratesCount?: number
}

export interface ShippingRate {
  id: string
  methodId?: string
  method?: {
    id: string
    name: string
    slug: string
  }
  rateType: RATE_TYPE
  baseRate: number
  additionalRate: number
  // Weight-based pricing
  minWeight?: number
  maxWeight?: number
  weightUnit?: number
  // Price-based pricing
  minOrderValue?: number
  maxOrderValue?: number
  // Distance-based pricing
  minDistance?: number
  maxDistance?: number
  distanceUnit?: number
  // Item-based pricing (NEW)
  firstItemCount?: number
  additionalItemRate?: number
  maxItems?: number
  maxShippingCost?: number
  // Conditions
  isActive: boolean
  priority: number
  name?: string
  description?: string
  // Special conditions
  isFreeShipping: boolean
  freeShippingThreshold?: number
  appliesToAllProducts: boolean
  productIds?: string[]
  categoryIds?: string[]
  excludedProductIds?: string[]
  excludedCategoryIds?: string[]
  // Time-based conditions
  validFrom?: Date
  validTo?: Date
  isHolidayRate: boolean
  holidayDates?: string[]
  // Additional fees
  handlingFee: number
  insuranceFee: number
  signatureFee: number
  createdAt: Date
  updatedAt: Date
}

// API Response Interfaces
export interface ShippingApiResponse<T> {
  message: string
  requestId: string
  data: T
  code: number
}

export interface ShippingPaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Calculation Interfaces
export interface ShippingCalculationParams {
  methodId: string
  weight?: number
  orderValue?: number
  distance?: number
  itemCount?: number
  productIds?: string[]
  categoryIds?: string[]
  isHoliday?: boolean
}

export interface ShippingCalculationResult {
  rate: ShippingRate
  totalCost: number
  breakdown: {
    baseRate: number
    additionalCost: number
    handlingFee: number
    insuranceFee: number
    signatureFee: number
  }
}

// Form Interfaces
export interface CreateShippingZoneDto {
  name: string
  description?: string
  zoneType: ZONE_TYPE
  countries?: string[]
  states?: string[]
  cities?: string[]
  postalCodes?: string[]
  isActive: boolean
  priority: number
  color?: string
}

export interface CreateShippingMethodDto {
  name: string
  description?: string
  methodType: METHOD_TYPE
  carrierType: CARRIER_TYPE
  zoneId?: string
  isActive: boolean
  priority: number
  estimatedDays?: number
  icon?: string
  color?: string
  isDefault: boolean
  requiresSignature: boolean
  isInsured: boolean
  insuranceAmount?: number
}

export interface CreateShippingRateDto {
  methodId: string
  rateType: RATE_TYPE
  baseRate: number
  additionalRate: number
  minWeight?: number
  maxWeight?: number
  weightUnit?: number
  minOrderValue?: number
  maxOrderValue?: number
  minDistance?: number
  maxDistance?: number
  distanceUnit?: number
  firstItemCount?: number
  additionalItemRate?: number
  maxItems?: number
  maxShippingCost?: number
  isActive: boolean
  priority: number
  name?: string
  description?: string
  isFreeShipping: boolean
  freeShippingThreshold?: number
  appliesToAllProducts: boolean
  productIds?: string[]
  categoryIds?: string[]
  excludedProductIds?: string[]
  excludedCategoryIds?: string[]
  validFrom?: Date
  validTo?: Date
  isHolidayRate: boolean
  holidayDates?: string[]
  handlingFee: number
  insuranceFee: number
  signatureFee: number
}

// Filter Interfaces
export interface ShippingZoneFilters {
  search?: string
  zoneType?: ZONE_TYPE
  isActive?: boolean
  page?: number
  limit?: number
}

export interface ShippingMethodFilters {
  search?: string
  methodType?: METHOD_TYPE
  carrierType?: CARRIER_TYPE
  zoneId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface ShippingRateFilters {
  search?: string
  rateType?: RATE_TYPE
  methodId?: string
  isActive?: boolean
  page?: number
  limit?: number
}
