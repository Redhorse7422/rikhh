import type { Product } from '@/types/common'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'

import { useFirebase } from '@/contexts/FirebaseContext'
import { firebaseAuthService } from '@/services/firebase/auth.firebase'
// import { cartFirebaseService } from '@/services/firebase/cart.firebase'
import { bookingFirebaseService } from '@/services/firebase/bookings.firebase'
import { categoryFirebaseService } from '@/services/firebase/category.firebase'
import { productFirebaseService } from '@/services/firebase/products.firebase'
import { userFirebaseService } from '@/services/firebase/users.firebase'

// Firebase Product Hooks
// export const useFirebaseProducts = (
//   params: {
//     search?: string
//     category?: string
//     minPrice?: number
//     maxPrice?: number
//     sortBy?: string
//     sortOrder?: 'asc' | 'desc'
//     limit?: number
//   } = {},
// ) => {
//   const { search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', limit = 8 } = params
//   return useQuery({
//     queryKey: ['firebase-products', params],
//     queryFn: async ({ pageParam }) =>
//       productFirebaseService.getAllProducts({
//         search,
//         category,
//         minPrice,
//         maxPrice,
//         sortBy,
//         sortOrder,
//         limit,
//         lastVisible: pageParam ?? null,
//       }),
//     staleTime: 5 * 60 * 1000,
//   })
// }

export const useFirebaseProducts = (
  params: {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    limit?: number
  } = {},
) => {
  const { search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', limit = 8 } = params

  return useInfiniteQuery({
    queryKey: ['firebase-products', params],
    queryFn: async ({ pageParam = null }) =>
      productFirebaseService.getAllProducts({
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        limit,
        lastVisible: pageParam,
      }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    },
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
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

export const useFirebaseProductById = (id: string) => {
  return useQuery({
    queryKey: ['firebase-product-id', id],
    queryFn: () => productFirebaseService.getProductById(id),
    enabled: !!id,
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

export const useFirebaseSearchProducts = (
  query: string,
  params: {
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {},
) => {
  const { limit = 16, sortBy = 'createdAt', sortOrder = 'desc' } = params
  console.log('Called Search')
  return useInfiniteQuery({
    queryKey: ['firebase-search-products', query, params],
    queryFn: async ({ pageParam = null }) =>
      productFirebaseService.searchProducts(query, {
        limit,
        lastVisible: pageParam,
        sortBy,
        sortOrder,
      }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    },
    initialPageParam: null,
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFirebaseSearchCount = (query: string) => {
  return useQuery({
    queryKey: ['firebase-search-count', query],
    queryFn: () => productFirebaseService.getSearchCount(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFirebaseCategory = (
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
    queryKey: ['firebase-categories', params],
    queryFn: () => categoryFirebaseService.getAllCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  // const featuredProducts = useFirebaseFeaturedProducts(8)
  // const newProducts = useFirebaseProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
  const {
    data: newProducts,
    isLoading,
    error,
  } = useFirebaseProducts({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 8,
  })

  return {
    data: {
      featured: newProducts?.pages.flatMap((page) => page.data) || [],
      new: newProducts?.pages.flatMap((page) => page.data) || [],
      variant: newProducts?.pages.flatMap((page) => page.data) || [],
      categories: [], // You'll need to implement categories separately
    },
    isLoading: isLoading,
    error: error,
  }
}

// Firebase User Hooks
export const useFirebaseUsers = (
  params: {
    search?: string
    status?: string
    provider?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    limit?: number
  } = {},
) => {
  const { search, status, provider, sortBy = 'createdAt', sortOrder = 'desc', limit = 10 } = params

  return useInfiniteQuery({
    queryKey: ['firebase-users', params],
    queryFn: async ({ pageParam = null }) =>
      userFirebaseService.getAllUsers({
        search,
        status,
        provider,
        sortBy,
        sortOrder,
        limit,
        lastVisible: pageParam,
      }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined
    },
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFirebaseUser = (uid: string) =>
  useQuery({
    queryKey: ['firebase-user', uid],
    queryFn: () => userFirebaseService.getUserByUid(uid),
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
  })

export const useFirebaseUserByPhone = (phone: string) =>
  useQuery({
    queryKey: ['firebase-user-phone', phone],
    queryFn: () => userFirebaseService.getUserByPhone(phone),
    enabled: !!phone,
    staleTime: 5 * 60 * 1000,
  })

export const useFirebaseUserByEmail = (email: string) =>
  useQuery({
    queryKey: ['firebase-user-email', email],
    queryFn: () => userFirebaseService.getUserByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  })

export const useFirebaseUserStats = () =>
  useQuery({
    queryKey: ['firebase-user-stats'],
    queryFn: () => userFirebaseService.getUserStats(),
    staleTime: 10 * 60 * 1000,
  })

// Booking Hooks
export const useFirebaseBookings = (userId: string) => {
  return useQuery({
    queryKey: ['firebase-bookings', userId],
    queryFn: () => bookingFirebaseService.getBookingsByUserId(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFirebaseSellerBookings = (sellerId: string) => {
  return useQuery({
    queryKey: ['firebase-seller-bookings', sellerId],
    queryFn: () => bookingFirebaseService.getBookingsBySellerId(sellerId),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFirebaseRecentBookings = (limit: number = 10) => {
  return useQuery({
    queryKey: ['firebase-recent-bookings', limit],
    queryFn: () => bookingFirebaseService.getRecentBookings(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFirebaseCreateBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (bookingData: any) => bookingFirebaseService.createBooking(bookingData),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['firebase-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['firebase-seller-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['firebase-recent-bookings'] })
    },
  })
}
