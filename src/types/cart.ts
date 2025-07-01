// Cart Page Types

import type { Product } from './common'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedVariant?: {
    id: string
    name: string
    value: string
    price?: number
  }
  price: number
  totalPrice: number
  inStock: boolean
  maxQuantity: number
}

export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  itemCount: number
}

export interface CartState {
  items: CartItem[]
  summary: CartSummary
  isLoading: boolean
  isUpdating: boolean
}

export interface CartPageProps {
  cart: CartState
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  onApplyCoupon: (code: string) => void
  onProceedToCheckout: () => void
}

export interface MiniCartProps {
  cart: CartState
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onViewCart: () => void
  onCheckout: () => void
}

export interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export interface CartSummaryProps {
  summary: CartSummary
  onApplyCoupon: (code: string) => void
  onProceedToCheckout: () => void
  isLoading?: boolean
}

export interface MiniCartItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export interface CouponFormProps {
  onApplyCoupon: (code: string) => void
  isLoading?: boolean
  appliedCoupon?: string
  onRemoveCoupon?: () => void
}

export interface EmptyCartProps {
  onContinueShopping: () => void
}
