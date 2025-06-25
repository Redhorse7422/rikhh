'use server'

import React from 'react'

import { MainLayout } from '@/components/Layouts/MainLayout'

export default async function AppTemplate({ children }: { children: React.JSX.Element }) {
  return <MainLayout>{children}</MainLayout>
}
