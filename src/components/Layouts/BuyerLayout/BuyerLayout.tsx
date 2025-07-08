'use client'

import React from 'react'

import { BuyerFooter } from './BuyerFooter'
import { BuyerHeader } from './BuyerHeader'
import { BuyerNavigation } from './BuyerNavigation'
import { BuyerTopBar } from './BuyerTopBar'
interface BuyerLayoutProps {
  children: React.ReactNode
}

export const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <BuyerTopBar />
      <BuyerHeader />
      <BuyerNavigation />
      <main className='flex-1'>{children}</main>
      <BuyerFooter />
    </div>
  )
}
