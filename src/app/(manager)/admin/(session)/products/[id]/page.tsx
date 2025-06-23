'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminEditProductPage } from '@/components/Pages/Admin/products/AdminEditProductPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Update Product' />
      <AdminEditProductPage />
    </>
  )
}
