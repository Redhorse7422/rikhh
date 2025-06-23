'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminAddProductPage } from '@/components/Pages/Admin/products/AdminAddProductPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='New Product' />
      <AdminAddProductPage />
    </>
  )
}
