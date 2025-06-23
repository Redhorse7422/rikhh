'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminProductsPage } from '@/components/Pages/Admin/products/AdminProductsPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Products' />
      <AdminProductsPage />
    </>
  )
}
