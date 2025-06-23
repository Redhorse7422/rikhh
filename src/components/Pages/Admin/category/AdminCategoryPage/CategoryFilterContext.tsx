'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

export interface CategoryFilterValues {
  search: string
}

interface CategoryFilterContextType {
  filters: CategoryFilterValues
  setFilters: (filters: CategoryFilterValues) => void
}

const CategoryFilterContext = createContext<CategoryFilterContextType | undefined>(undefined)

export const CategoryFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<CategoryFilterValues>({
    search: '',
  })

  return <CategoryFilterContext.Provider value={{ filters, setFilters }}>{children}</CategoryFilterContext.Provider>
}

export const useCategoryFilter = () => {
  const context = useContext(CategoryFilterContext)
  if (!context) {
    throw new Error('useCategoryFilter must be used within CategoryFilterProvider')
  }
  return context
}
