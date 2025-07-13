'use client'

import type { ShippingMethodFilters, METHOD_TYPE, CARRIER_TYPE } from '@/types/shipping'

import { createContext, useContext, useState } from 'react'

interface ShippingMethodFilterContextType {
  filters: ShippingMethodFilters
  setFilters: (filters: ShippingMethodFilters) => void
  updateFilters: (updates: Partial<ShippingMethodFilters>) => void
  resetFilters: () => void
}

const ShippingMethodFilterContext = createContext<ShippingMethodFilterContextType | undefined>(undefined)

const initialFilters: ShippingMethodFilters = {
  search: '',
  methodType: undefined,
  carrierType: undefined,
  zoneId: undefined,
  isActive: undefined,
  page: 1,
  limit: 10,
}

export const ShippingMethodFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<ShippingMethodFilters>(initialFilters)

  const updateFilters = (updates: Partial<ShippingMethodFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <ShippingMethodFilterContext.Provider value={{ filters, setFilters, updateFilters, resetFilters }}>
      {children}
    </ShippingMethodFilterContext.Provider>
  )
}

export const useShippingMethodFilter = () => {
  const context = useContext(ShippingMethodFilterContext)
  if (!context) {
    throw new Error('useShippingMethodFilter must be used within a ShippingMethodFilterProvider')
  }
  return context
}
