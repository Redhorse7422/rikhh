'use client'

import type { ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { userSessionService } from '@/services/user-session.service'

// Define the user interface locally
interface FirestoreUser {
  uid: string
  name: string
  email: string
  phone: string
  provider: 'PHONE' | 'EMAIL' | 'GOOGLE' | 'FACEBOOK'
  status: 'approved' | 'pending' | 'rejected' | 'blocked'
  isApproved: boolean
  isBlocked: boolean
  isDeleteMarked: boolean
  image_url?: string
  address?: string
  createdAt?: any
  updatedAt?: any
}

interface UserContextType {
  user: FirestoreUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string) => Promise<{ success: boolean; user?: FirestoreUser; error?: string }>
  logout: () => void
  refreshUser: (phoneNumber: string) => Promise<FirestoreUser | null>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<FirestoreUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = () => {
      try {
        const currentUser = userSessionService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (phoneNumber: string) => {
    try {
      setIsLoading(true)
      const result = await userSessionService.loginUser(phoneNumber)

      if (result.success && result.user) {
        setUser(result.user)
      }

      return result
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    userSessionService.logoutUser()
    setUser(null)
  }

  const refreshUser = async (phoneNumber: string) => {
    try {
      const refreshedUser = await userSessionService.refreshUserData(phoneNumber)
      if (refreshedUser) {
        setUser(refreshedUser)
      }
      return refreshedUser
    } catch (error) {
      console.error('Refresh user error:', error)
      return null
    }
  }

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
