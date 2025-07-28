'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

// import { MiniCart } from '@/components/Pages/Buyer/CartPage/components/MiniCart'
import { Icon } from '@/components/common/icon'
// import { useCart } from '@/contexts/CartContext'

export const CartIcon: React.FC = () => {
  // const { cart, updateQuantity, removeItem } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const router = useRouter()

  const handleOpenMiniCart = () => {
    setIsMiniCartOpen(true)
  }

  const handleCloseMiniCart = () => {
    setIsMiniCartOpen(false)
  }

  const handleViewCart = () => {
    setIsMiniCartOpen(false)
    router.push('/cart')
  }

  const handleCheckout = () => {
    setIsMiniCartOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      <button
        onClick={handleOpenMiniCart}
        className='relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      >
        <Icon name='AiOutlineShopping' className='h-6 w-6' />
        {/* {cart.summary.itemCount > 0 && (
          <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white'>
            {cart.summary.itemCount > 99 ? '99+' : cart.summary.itemCount}
          </span>
        )} */}
      </button>

      {/* <MiniCart
        cart={cart}
        isOpen={isMiniCartOpen}
        onClose={handleCloseMiniCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onViewCart={handleViewCart}
        onCheckout={handleCheckout}
      /> */}
    </>
  )
}
