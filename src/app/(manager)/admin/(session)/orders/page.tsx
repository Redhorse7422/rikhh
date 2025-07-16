'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminOrdersPage } from '@/components/Pages/Admin/orders/AdminOrdersPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Orders' />
      <AdminOrdersPage />
    </>
  )
}
