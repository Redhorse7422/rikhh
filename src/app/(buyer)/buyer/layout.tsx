'use client'

import React from 'react'

import { AgeConfirmationGate } from '@/components/AgeConfirmationGate'
import { BuyerLayout } from '@/components/Layouts/BuyerLayout/BuyerLayout'
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <AgeConfirmationGate>
      <BuyerLayout>{children}</BuyerLayout>
    </AgeConfirmationGate>
  )
}
