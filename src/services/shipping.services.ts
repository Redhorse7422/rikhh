import type {
  ShippingZone,
  ShippingMethod,
  ShippingRate,
  CreateShippingZoneDto,
  CreateShippingMethodDto,
  CreateShippingRateDto,
  ShippingZoneFilters,
  ShippingMethodFilters,
  ShippingRateFilters,
  ShippingCalculationParams,
  ShippingCalculationResult,
  ShippingPaginatedResponse,
  ShippingApiResponse,
} from '@/types/shipping'

import { client } from '@/libs/axios'

// Shipping Zones API
export const shippingZonesApi = {
  // Create shipping zone
  create: async (data: CreateShippingZoneDto): Promise<ShippingApiResponse<ShippingZone>> => {
    return client.post('/v1/shipping/zones/store', data)
  },

  // Get all shipping zones (paginated)
  getAll: async (
    filters?: ShippingZoneFilters,
  ): Promise<ShippingApiResponse<ShippingPaginatedResponse<ShippingZone>>> => {
    return client.get('/v1/shipping/zones/all', { params: filters })
  },

  // Get active shipping zones
  getActive: async (): Promise<ShippingApiResponse<ShippingZone[]>> => {
    return client.get('/v1/shipping/zones/active')
  },

  // Find matching zone
  matchZone: async (params: {
    country?: string
    state?: string
    city?: string
    postalCode?: string
  }): Promise<ShippingApiResponse<ShippingZone[]>> => {
    return client.get('/v1/shipping/zones/match', { params })
  },

  // Get shipping zone by ID
  getById: async (id: string): Promise<ShippingApiResponse<ShippingZone>> => {
    return client.get(`/v1/shipping/zones/${id}`)
  },

  // Get shipping zone by slug
  getBySlug: async (slug: string): Promise<ShippingApiResponse<ShippingZone>> => {
    return client.get(`/v1/shipping/zones/slug/${slug}`)
  },

  // Update shipping zone
  update: async (id: string, data: Partial<CreateShippingZoneDto>): Promise<ShippingApiResponse<ShippingZone>> => {
    return client.put(`/v1/shipping/zones/update/${id}`, data)
  },

  // Delete shipping zone
  delete: async (id: string): Promise<ShippingApiResponse<void>> => {
    return client.delete(`/v1/shipping/zones/${id}`)
  },
}

// Shipping Methods API
export const shippingMethodsApi = {
  // Create shipping method
  create: async (data: CreateShippingMethodDto): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.post('/v1/shipping/methods/store', data)
  },

  // Get all shipping methods (paginated)
  getAll: async (
    filters?: ShippingMethodFilters,
  ): Promise<ShippingApiResponse<ShippingPaginatedResponse<ShippingMethod>>> => {
    return client.get('/v1/shipping/methods/all', { params: filters })
  },

  // Get active shipping methods
  getActive: async (): Promise<ShippingApiResponse<ShippingMethod[]>> => {
    return client.get('/v1/shipping/methods/active')
  },

  // Get default shipping method
  getDefault: async (): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.get('/v1/shipping/methods/default')
  },

  // Get methods by zone
  getByZone: async (zoneId: string): Promise<ShippingApiResponse<ShippingMethod[]>> => {
    return client.get(`/v1/shipping/methods/zone/${zoneId}`)
  },

  // Get shipping method by ID
  getById: async (id: string): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.get(`/v1/shipping/methods/${id}`)
  },

  // Get shipping method by slug
  getBySlug: async (slug: string): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.get(`/v1/shipping/methods/slug/${slug}`)
  },

  // Update shipping method
  update: async (id: string, data: Partial<CreateShippingMethodDto>): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.put(`/v1/shipping/methods/update/${id}`, data)
  },

  // Set default method
  setDefault: async (id: string): Promise<ShippingApiResponse<ShippingMethod>> => {
    return client.put(`/v1/shipping/methods/${id}/set-default`)
  },

  // Delete shipping method
  delete: async (id: string): Promise<ShippingApiResponse<void>> => {
    return client.delete(`/v1/shipping/methods/${id}`)
  },
}

// Shipping Rates API
export const shippingRatesApi = {
  // Create shipping rate
  create: async (data: CreateShippingRateDto): Promise<ShippingApiResponse<ShippingRate>> => {
    return client.post('/v1/shipping/rates/store', data)
  },

  // Get all shipping rates (paginated)
  getAll: async (
    filters?: ShippingRateFilters,
  ): Promise<ShippingApiResponse<ShippingPaginatedResponse<ShippingRate>>> => {
    return client.get('/v1/shipping/rates/all', { params: filters })
  },

  // Get rates by method
  getByMethod: async (methodId: string): Promise<ShippingApiResponse<ShippingRate[]>> => {
    return client.get(`/v1/shipping/rates/method/${methodId}`)
  },

  // Get shipping rate by ID
  getById: async (id: string): Promise<ShippingApiResponse<ShippingRate>> => {
    return client.get(`/v1/shipping/rates/${id}`)
  },

  // Update shipping rate
  update: async (id: string, data: Partial<CreateShippingRateDto>): Promise<ShippingApiResponse<ShippingRate>> => {
    return client.put(`/v1/shipping/rates/update/${id}`, data)
  },

  // Delete shipping rate
  delete: async (id: string): Promise<ShippingApiResponse<void>> => {
    return client.delete(`/v1/shipping/rates/${id}`)
  },
}

// Shipping Calculator API
export const shippingCalculatorApi = {
  // Calculate shipping cost for single method
  calculate: async (params: ShippingCalculationParams): Promise<ShippingApiResponse<ShippingCalculationResult>> => {
    return client.post('/v1/shipping/rates/calculate', params)
  },

  // Calculate shipping costs for multiple methods
  calculateMultiple: async (
    params: ShippingCalculationParams[],
  ): Promise<ShippingApiResponse<ShippingCalculationResult[]>> => {
    return client.post('/v1/shipping/rates/calculate-multiple', params)
  },

  // Calculate shipping options for checkout
  calculateCheckoutOptions: async (params: {
    items: Array<{
      id: string
      productId: string
      quantity: number
      price: number
      weight: number
      categoryIds: string[]
    }>
    shippingAddress: {
      country: string
      state: string
      city: string
      postalCode: string
    }
    orderValue: number
    isHoliday?: boolean
  }): Promise<
    ShippingApiResponse<
      Array<{
        methodId: string
        methodName: string
        rateType: string
        baseRate: number
        additionalCost: number
        totalCost: number
        estimatedDays: number
        isDefault: boolean
        breakdown: {
          baseRate: number
          additionalCost: number
          handlingFee: number
          insuranceFee: number
          signatureFee: number
        }
      }>
    >
  > => {
    return client.post('/v1/shipping/checkout/calculate-options', params)
  },
}

// Helper functions
export const shippingHelpers = {
  // Calculate item-based shipping cost
  calculateItemBasedCost: (rate: ShippingRate, itemCount: number): number => {
    if (rate.rateType !== 'item_based') return 0

    const additionalItems = Math.max(0, itemCount - (rate.firstItemCount || 0))

    let totalCost = rate.baseRate + additionalItems * (rate.additionalItemRate || 0)

    if (rate.maxShippingCost && totalCost > rate.maxShippingCost) {
      totalCost = rate.maxShippingCost
    }

    return totalCost
  },

  // Get zone type label
  getZoneTypeLabel: (zoneType: string): string => {
    const labels = {
      country: 'Country',
      state: 'State',
      city: 'City',
      postal_code: 'Postal Code',
      custom: 'Custom',
    }
    return labels[zoneType as keyof typeof labels] || zoneType
  },

  // Get method type label
  getMethodTypeLabel: (methodType: string): string => {
    const labels = {
      flat_rate: 'Flat Rate',
      free_shipping: 'Free Shipping',
      weight_based: 'Weight Based',
      price_based: 'Price Based',
      distance_based: 'Distance Based',
    }
    return labels[methodType as keyof typeof labels] || methodType
  },

  // Get carrier type label
  getCarrierTypeLabel: (carrierType: string): string => {
    const labels = {
      standard: 'Standard',
      express: 'Express',
      premium: 'Premium',
      economy: 'Economy',
      same_day: 'Same Day',
      next_day: 'Next Day',
    }
    return labels[carrierType as keyof typeof labels] || carrierType
  },

  // Get rate type label
  getRateTypeLabel: (rateType: string): string => {
    const labels = {
      flat_rate: 'Flat Rate',
      weight_based: 'Weight Based',
      price_based: 'Price Based',
      distance_based: 'Distance Based',
      free: 'Free',
      item_based: 'Item Based',
    }
    return labels[rateType as keyof typeof labels] || rateType
  },
}
