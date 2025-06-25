'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { InvoiceTable } from '@/components/Tables/invoice-table'

export default function TablesPage() {
  return (
    <>
      <Breadcrumb pageName='Tables' />

      <div className='mx-auto w-full max-w-[1080px]'>
        <InvoiceTable />
      </div>
    </>
  )
}
