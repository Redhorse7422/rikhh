'use client'

import type { ShippingZoneFilters, ZONE_TYPE } from '@/types/shipping'

import { createContext, useContext, useState } from 'react'

interface ShippingZoneFilterContextType {
  filters: ShippingZoneFilters
  setFilters: (filters: ShippingZoneFilters) => void
  updateFilters: (updates: Partial<ShippingZoneFilters>) => void
  resetFilters: () => void
}

const ShippingZoneFilterContext = createContext<ShippingZoneFilterContextType | undefined>(undefined)

const initialFilters: ShippingZoneFilters = {
  search: '',
  zoneType: undefined,
  isActive: undefined,
  page: 1,
  limit: 10,
}

export const ShippingZoneFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<ShippingZoneFilters>(initialFilters)

  const updateFilters = (updates: Partial<ShippingZoneFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <ShippingZoneFilterContext.Provider value={{ filters, setFilters, updateFilters, resetFilters }}>
      {children}
    </ShippingZoneFilterContext.Provider>
  )
}

export const useShippingZoneFilter = () => {
  const context = useContext(ShippingZoneFilterContext)
  if (!context) {
    throw new Error('useShippingZoneFilter must be used within a ShippingZoneFilterProvider')
  }
  return context
}
