'use client'

import { SectionFilter } from './SectionFilter'
import { SectionRates } from './SectionRates'
import { ShippingRateFilterProvider } from './ShippingRateFilterContext'

export const AdminShippingRatesPage = () => {
  return (
    <ShippingRateFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionRates />
      </div>
    </ShippingRateFilterProvider>
  )
}
