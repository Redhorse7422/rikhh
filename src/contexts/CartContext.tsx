'use client'

import type { AddToCartDto, CartVariantDto } from '@/services/cart.services'
import type { CartState, CartItem } from '@/types/cart'

import type { ReactNode } from 'react'
import React, { createContext, useContext, useReducer, useEffect } from 'react'

import { addToCart, getCartItems, updateCartItem, removeCartItem } from '@/services/cart.services'

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartState }

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
          summary: calculateSummary(updatedItems),
        }
      }

      // Add new item if it doesn't exist
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems),
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems),
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        summary: calculateSummary([]),
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

    default:
      return state
  }
}

// Calculate cart summary
const calculateSummary = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  // const shipping = subtotal >= 50 ? 0 : 5.99 // Free shipping over $50
  const shipping = 0 // Free shipping over $50
  const tax = 0 // 8% tax rate
  // const tax = subtotal * 0.08 // 8% tax rate
  const discount = 0 // TODO: Implement coupon logic
  const total = subtotal + shipping + tax - discount

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

// Initial cart state
const initialState: CartState = {
  items: [],
  summary: calculateSummary([]),
  isLoading: false,
  isUpdating: false,
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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider
interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

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
