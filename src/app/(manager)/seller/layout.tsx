'use client'

import React from 'react'

import { SellerLayout } from '@/components/Layouts/SellerLayout'

export default function SellerTemplateLayout({ children }: { children: React.ReactNode }) {
  return <SellerLayout>{children}</SellerLayout>
}
