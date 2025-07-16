'use client'

import type { AddToCartDto } from '@/services/cart.services'
import type { CartState, CartItem } from '@/types/cart'
import type { AppliedCoupon } from '@/types/coupon'

import type { ReactNode } from 'react'
import React, { createContext, useContext, useReducer } from 'react'

import { getSession } from 'next-auth/react'

import useToast from '@/hooks/useToast'
import { getGuestId } from '@/services/cart.guest'
import { addToCart, getCartItems, updateCartItem, removeCartItem } from '@/services/cart.services'
import { validateCouponForCart } from '@/services/coupon.services'

// Helper function to get current user ID or guest ID
async function getCurrentUserId(): Promise<{ userId?: string; guestId?: string }> {
  try {
    const session = await getSession()
    if (session?.user?.id) {
      // Use buyerId if available, otherwise use the general id
      const userId = session.user.buyerId || session.user.id
      return { userId }
    }
    const guestId = getGuestId()
    return guestId ? { guestId } : {}
  } catch (error) {
    console.error('Error getting session:', error)
    const guestId = getGuestId()
    return guestId ? { guestId } : {}
  }
}

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartState }
  | { type: 'APPLY_COUPON'; payload: AppliedCoupon }
  | { type: 'REMOVE_COUPON' }

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
        return {
          ...state,
          items: updatedItems,
          summary: calculateSummary(updatedItems, state.appliedCoupon),
        }
      }

      // Add new item if it doesn't exist
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems, state.appliedCoupon),
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems, state.appliedCoupon),
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems, state.appliedCoupon),
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        summary: calculateSummary([]),
        appliedCoupon: undefined,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'SET_UPDATING':
      return {
        ...state,
        isUpdating: action.payload,
      }

    case 'SET_CART':
      return {
        ...state,
        ...action.payload,
      }

    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload,
        summary: calculateSummary(state.items, action.payload),
      }

    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: undefined,
        summary: calculateSummary(state.items),
      }

    default:
      return state
  }
}

// Calculate cart summary with coupon support
const calculateSummary = (items: CartItem[], appliedCoupon?: AppliedCoupon) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const shipping = 0 // Shipping will be calculated through shipping-calculate API
  const tax = 0 // Tax will be calculated through checkout API
  const discount = appliedCoupon?.discountAmount || 0
  const total = subtotal + shipping + tax - discount

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    appliedCoupon,
  }
}

// Initial cart state
const initialState: CartState = {
  items: [],
  summary: calculateSummary([]),
  isLoading: false,
  isUpdating: false,
  appliedCoupon: undefined,
}

// Cart Context
interface CartContextType {
  cart: CartState
  addItem: (item: AddToCartDto) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  setLoading: (loading: boolean) => void
  setUpdating: (updating: boolean) => void
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
  updateSummaryAndCoupon: (summary: any, appliedCoupon: AppliedCoupon) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState)
  const { showToast } = useToast()

  // Fetch cart from backend
  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const data = await getCartItems()
      // Transform backend response to CartState shape if needed
      const cartState: CartState = {
        items: data.items || [],
        summary: data.summary || calculateSummary(data.items || []),
        isLoading: false,
        isUpdating: false,
        appliedCoupon: undefined, // Coupon state will be managed separately
      }
      dispatch({
        type: 'SET_CART',
        payload: cartState,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Add item to cart via backend
  const addItem = async (item: AddToCartDto) => {
    dispatch({ type: 'SET_UPDATING', payload: true })
    try {
      await addToCart(item)
      await fetchCart()
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false })
    }
  }

  // Update cart item via backend
  const updateQuantity = async (itemId: string, quantity: number) => {
    dispatch({ type: 'SET_UPDATING', payload: true })
    try {
      await updateCartItem(itemId, { quantity })
      await fetchCart()
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false })
    }
  }

  // Remove cart item via backend
  const removeItem = async (itemId: string) => {
    dispatch({ type: 'SET_UPDATING', payload: true })
    try {
      await removeCartItem(itemId)
      await fetchCart()
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false })
    }
  }

  const clearCart = async () => {
    // Optionally implement a backend endpoint to clear cart
    // For now, remove all items one by one
    for (const item of cart.items) {
      await removeCartItem(item.id)
    }
    await fetchCart()
  }

  // Apply coupon to cart (Stage 1: Preview)
  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      showToast('Please enter a coupon code', 'error')
      return
    }

    dispatch({ type: 'SET_UPDATING', payload: true })
    try {
      const userInfo = await getCurrentUserId()
      const updatedItems = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
        ...(item.product.category && { categoryId: item.product.category }),
      })) as any

      const validationRequest = {
        couponCode: code.trim().toUpperCase(),
        items: updatedItems,
        subtotal: cart.summary.subtotal,
        // ...userInfo,
      }

      const response = (await validateCouponForCart(validationRequest)) as any

      if (response.isValid) {
        const appliedCoupon: AppliedCoupon = {
          code: response.coupon?.code || code,
          name: response.coupon?.name,
          type: response.coupon?.type || 'percentage',
          value: response.coupon?.value || 0,
          discountAmount: response.discountAmount,
          appliedAt: new Date().toISOString(),
        }

        dispatch({ type: 'APPLY_COUPON', payload: appliedCoupon })
        showToast(`Coupon "${code}" applied successfully! You saved $${response.discountAmount.toFixed(2)}`, 'success')
      } else {
        showToast(response.data.message || 'Invalid coupon code', 'error')
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      showToast('Failed to apply coupon. Please try again.', 'error')
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false })
    }
  }

  // Remove coupon from cart
  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' })
    showToast('Coupon removed', 'success')
  }

  // Add this function to update summary and applied coupon
  const updateSummaryAndCoupon = (summary: any, appliedCoupon: AppliedCoupon) => {
    dispatch({
      type: 'SET_CART',
      payload: {
        ...cart,
        summary: {
          ...cart.summary,
          ...summary,
          appliedCoupon,
        },
        appliedCoupon,
      },
    })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setUpdating = (updating: boolean) => {
    dispatch({ type: 'SET_UPDATING', payload: updating })
  }

  React.useEffect(() => {
    fetchCart()
  }, [])

  const value: CartContextType = {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    setLoading,
    setUpdating,
    applyCoupon,
    removeCoupon,
    updateSummaryAndCoupon,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Cart Hook
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
