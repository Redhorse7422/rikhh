'use client'

import type { User } from 'firebase/auth'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { onAuthStateChange, getCurrentUser } from '@/libs/firebase/auth'

interface FirebaseContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setLoading(false)
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user1) => {
      setUser(user1)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}
