'use client'

import { SectionFilter } from './SectionFilter'
import { SectionMethods } from './SectionMethods'
import { ShippingMethodFilterProvider } from './ShippingMethodFilterContext'

export const AdminShippingMethodsPage = () => {
  return (
    <ShippingMethodFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionMethods />
      </div>
    </ShippingMethodFilterProvider>
  )
}
