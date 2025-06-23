'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

export interface ProductFilterValues {
  search: string
}

interface ProductFilterContextType {
  filters: ProductFilterValues
  setFilters: (filters: ProductFilterValues) => void
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined)

export const ProductFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<ProductFilterValues>({
    search: '',
  })

  return <ProductFilterContext.Provider value={{ filters, setFilters }}>{children}</ProductFilterContext.Provider>
}

export const useProductFilter = () => {
  const context = useContext(ProductFilterContext)
  if (!context) {
    throw new Error('useProductFilter must be used within ProductFilterProvider')
  }
  return context
}
