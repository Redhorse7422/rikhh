'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminAddCategoryPage } from '@/components/Pages/Admin/AdminAddCategoryPage'
import { AdminCategoryPage } from '@/components/Pages/Admin/AdminCategoryPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Categories' />
      <AdminAddCategoryPage />
    </>
  )
}
