'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminCategoryPage } from '@/components/Pages/Admin/category/AdminCategoryPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Categories' />
      <AdminCategoryPage />
    </>
  )
}
