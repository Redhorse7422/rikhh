'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useCart } from '@/contexts/CartContext'

import { CartItems } from './components/CartItems'
import { CartMigrationPrompt } from './components/CartMigrationPrompt'
import { CartSummary } from './components/CartSummary'
import { EmptyCart } from './components/EmptyCart'

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const router = useRouter()
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(true)
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantity(itemId, quantity)
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  const handleApplyCoupon = (code: string) => {
    // TODO: Implement coupon logic
    console.log('Applying coupon:', code)
  }

  const handleProceedToCheckout = () => {
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    // TODO: Navigate to products page
    console.log('Continuing shopping')
  }

  if (cart.isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-8 h-4 w-1/4 rounded bg-gray-200'></div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              <div className='space-y-4 lg:col-span-2'>
                <div className='h-32 rounded bg-gray-200'></div>
                <div className='h-32 rounded bg-gray-200'></div>
                <div className='h-32 rounded bg-gray-200'></div>
              </div>
              <div className='h-96 rounded bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='border-b bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
            <Breadcrumb pageName='Shopping Cart' />
          </div>
        </div>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <EmptyCart onContinueShopping={handleContinueShopping} />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='border-b bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
          <Breadcrumb pageName='Shopping Cart' />
        </div>
      </div>

      {/* Main Cart Section */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            {showMigrationPrompt && <CartMigrationPrompt onDismiss={() => setShowMigrationPrompt(false)} />}
            <CartItems
              items={cart.items}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              isUpdating={cart.isUpdating}
            />
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-1'>
            <CartSummary
              summary={cart.summary}
              onApplyCoupon={handleApplyCoupon}
              onProceedToCheckout={handleProceedToCheckout}
              isLoading={cart.isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
