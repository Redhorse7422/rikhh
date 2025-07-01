'use client'

import type { CartState, CartItem } from '@/types/cart'

import type { ReactNode } from 'react'
import React, { createContext, useContext, useReducer } from 'react'

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }

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

    default:
      return state
  }
}

// Calculate cart summary
const calculateSummary = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const shipping = subtotal >= 50 ? 0 : 5.99 // Free shipping over $50
  const tax = subtotal * 0.08 // 8% tax rate
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
  addItem: (item: CartItem) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
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

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setUpdating = (updating: boolean) => {
    dispatch({ type: 'SET_UPDATING', payload: updating })
  }

  const value: CartContextType = {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
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
