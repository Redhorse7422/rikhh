'use client'

import type { ShippingRateFilters, RATE_TYPE } from '@/types/shipping'

import { createContext, useContext, useState } from 'react'

interface ShippingRateFilterContextType {
  filters: ShippingRateFilters
  setFilters: (filters: ShippingRateFilters) => void
  updateFilters: (updates: Partial<ShippingRateFilters>) => void
  resetFilters: () => void
}

const ShippingRateFilterContext = createContext<ShippingRateFilterContextType | undefined>(undefined)

const initialFilters: ShippingRateFilters = {
  search: '',
  rateType: undefined,
  methodId: undefined,
  isActive: undefined,
  page: 1,
  limit: 10,
}

export const ShippingRateFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<ShippingRateFilters>(initialFilters)

  const updateFilters = (updates: Partial<ShippingRateFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <ShippingRateFilterContext.Provider value={{ filters, setFilters, updateFilters, resetFilters }}>
      {children}
    </ShippingRateFilterContext.Provider>
  )
}

export const useShippingRateFilter = () => {
  const context = useContext(ShippingRateFilterContext)
  if (!context) {
    throw new Error('useShippingRateFilter must be used within a ShippingRateFilterProvider')
  }
  return context
}
