'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

import type { UserFilterValues } from '@/types/user'

interface UserFilterContextType {
  filters: UserFilterValues
  setFilters: (filters: UserFilterValues) => void
}

const UserFilterContext = createContext<UserFilterContextType | undefined>(undefined)

export const UserFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<UserFilterValues>({
    search: '',
    role: '',
    status: '',
    emailVerified: '',
    dateRange: {
      start: '',
      end: '',
    },
  })

  return <UserFilterContext.Provider value={{ filters, setFilters }}>{children}</UserFilterContext.Provider>
}

export const useUserFilter = () => {
  const context = useContext(UserFilterContext)
  if (!context) {
    throw new Error('useUserFilter must be used within UserFilterProvider')
  }
  return context
} 