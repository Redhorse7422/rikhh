import type { Product } from '@/types/common'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useFirebase } from '@/contexts/FirebaseContext'
import { firebaseAuthService } from '@/services/firebase/auth.firebase'
// import { cartFirebaseService } from '@/services/firebase/cart.firebase'
import { productFirebaseService } from '@/services/firebase/products.firebase'

// Firebase Product Hooks
export const useFirebaseProducts = (
  params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {},
) => {
  return useQuery({
    queryKey: ['firebase-products', params],
    queryFn: () => productFirebaseService.getAllProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useFirebaseProduct = (id: string) => {
  return useQuery({
    queryKey: ['firebase-product', id],
    queryFn: () => productFirebaseService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFirebaseProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['firebase-product-slug', slug],
    queryFn: () => productFirebaseService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFirebaseFeaturedProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['firebase-featured-products', limit],
    queryFn: () => productFirebaseService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useFirebaseProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['firebase-products-category', category],
    queryFn: () => productFirebaseService.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFirebaseSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['firebase-search-products', query],
    queryFn: () => productFirebaseService.searchProducts(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Firebase Auth Hooks
export const useFirebaseAuth = () => {
  const { user, loading, isAuthenticated } = useFirebase()

  const signIn = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      firebaseAuthService.signIn(email, password),
  })

  const signUp = useMutation({
    mutationFn: ({ email, password, displayName }: { email: string; password: string; displayName?: string }) =>
      firebaseAuthService.signUp(email, password, displayName),
  })

  const signOut = useMutation({
    mutationFn: () => firebaseAuthService.signOut(),
  })

  const updateProfile = useMutation({
    mutationFn: (updates: { displayName?: string; photoURL?: string }) => firebaseAuthService.updateProfile(updates),
  })

  const sendPasswordReset = useMutation({
    mutationFn: (email: string) => firebaseAuthService.sendPasswordResetEmail(email),
  })

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    sendPasswordReset,
  }
}

// Firebase Home Config Hook (replaces the existing home config)
export const useFirebaseHomeConfig = () => {
  const featuredProducts = useFirebaseFeaturedProducts(8)
  const newProducts = useFirebaseProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })

  // For now, we'll use the same products for different sections
  // You can modify this based on your needs
  const variantProducts = useFirebaseProducts({ limit: 8, sortBy: 'regularPrice', sortOrder: 'asc' })

  return {
    data: {
      featured: featuredProducts.data || [],
      new: newProducts.data?.data || [],
      variant: variantProducts.data?.data || [],
      categories: [], // You'll need to implement categories separately
    },
    isLoading: featuredProducts.isLoading || newProducts.isLoading || variantProducts.isLoading,
    error: featuredProducts.error || newProducts.error || variantProducts.error,
  }
}
