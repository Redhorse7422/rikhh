'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminEditCategoryPage } from '@/components/Pages/Admin/category/AdminEditCategoryPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='New Category' />
      <AdminEditCategoryPage />
    </>
  )
}
