'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminCouponsPage } from '@/components/Pages/Admin/coupons/AdminCouponsPage'

export default function page() {
  return (
    <>
      <Breadcrumb pageName='Coupons' />
      <AdminCouponsPage />
    </>
  )
}
