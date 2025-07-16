'use client'

import type { CouponFilterValues } from '@/types/coupon'

import { createContext, useContext, useState } from 'react'

interface CouponFilterContextType {
  filters: CouponFilterValues
  setFilters: (filters: CouponFilterValues) => void
}

const CouponFilterContext = createContext<CouponFilterContextType | undefined>(undefined)

export const useCouponFilter = () => {
  const context = useContext(CouponFilterContext)
  if (!context) {
    throw new Error('useCouponFilter must be used within a CouponFilterProvider')
  }
  return context
}

interface CouponFilterProviderProps {
  children: React.ReactNode
}

export const CouponFilterProvider = ({ children }: CouponFilterProviderProps) => {
  const [filters, setFilters] = useState<CouponFilterValues>({
    search: '',
    type: '',
    status: '',
    isActive: undefined,
    validFrom: '',
    validUntil: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  return (
    <CouponFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </CouponFilterContext.Provider>
  )
}
