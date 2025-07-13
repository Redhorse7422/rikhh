import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/common'

import { getSession } from 'next-auth/react'

import { client } from '@/libs/axios'

import { getGuestId, setGuestId } from './cart.guest'

// DTOs
export interface CartVariantDto {
  attributeId: string
  attributeValueId: string
  attributeName: string
  attributeValue: string
}

export interface AddToCartDto {
  productId: string
  quantity?: number
  guestId?: string
  userId?: string
  variants?: CartVariantDto[]
  price?: number
}

export interface CartBackendResponse {
  items: CartItem[]
  summary: any
}

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

// Calculate cart summary (copied from CartContext)
function calculateSummary(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const shipping = 0 // Shipping will be calculated through shipping-calculate API
  const tax = 0 // Tax will be calculated through checkout API
  const discount = 0 // TODO: Implement coupon logic
  const total = subtotal + shipping + tax - discount
  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity), 0),
  }
}

function mapBackendCartItemToCartItem(item: any): CartItem {
  // Map backend cart item to frontend CartItem type
  return {
    id: item.id,
    product: item.product as Product,
    quantity: Number(item.quantity),
    price: Number(item.price),
    totalPrice: Number(item.price) * Number(item.quantity),
    inStock: item.product?.stock > 0,
    maxQuantity: item.product?.stock || 1,
    // Optionally map variants if present
    selectedVariant:
      item.variants && Array.isArray(item.variants) && item.variants.length > 0
        ? {
            id: item.variants[0].attributeValueId,
            name: item.variants[0].attributeName,
            value: item.variants[0].attributeValue,
            price: Number(item.price),
          }
        : undefined,
  }
}

// Add item to cart
export const addToCart = async (data: AddToCartDto) => {
  const { userId, guestId } = await getCurrentUserId()
  const payload = {
    ...data,
    ...(userId ? { userId } : { guestId: data.guestId || guestId }),
  }
  const response = (await client.post('/v1/cart/add', payload)) as { guestId?: string }
  // If backend returns guestId in the cart item, persist it (only for guest users)
  if (response && response.guestId && !userId) {
    setGuestId(response.guestId)
  }
  return response
}

// Get all cart items
export const getCartItems = async (): Promise<CartBackendResponse> => {
  const { userId, guestId } = await getCurrentUserId()
  // Send userId or guestId as query param
  const params = userId ? { userId } : guestId ? { guestId } : undefined
  const response = await client.get('/v1/cart/items', params ? { params } : undefined)
  // response is the full backend response; items are in response.data
  const itemsRaw = (response as any) || []
  console.log('itemsRaw ==> ', itemsRaw)
  const items: CartItem[] = itemsRaw.map(mapBackendCartItemToCartItem)
  const summary = calculateSummary(items)
  return { items, summary }
}

// Update cart item
export const updateCartItem = async (id: string, data: Partial<AddToCartDto>) => {
  // const { userId, guestId } = await getCurrentUserId()
  const payload = {
    ...data,
    // ...(userId ? { userId } : { guestId }),
  }
  return client.put(`/v1/cart/update/${id}`, payload)
}

// Remove cart item
export const removeCartItem = async (id: string) => {
  const { userId, guestId } = await getCurrentUserId()
  const params = userId ? { userId } : guestId ? { guestId } : undefined
  return client.delete(`/v1/cart/remove/${id}`, { params })
}
