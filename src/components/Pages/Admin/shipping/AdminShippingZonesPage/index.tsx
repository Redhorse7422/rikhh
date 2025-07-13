'use client'

import { SectionFilter } from './SectionFilter'
import { SectionZones } from './SectionZones'
import { ShippingZoneFilterProvider } from './ShippingZoneFilterContext'

export const AdminShippingZonesPage = () => {
  return (
    <ShippingZoneFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionZones />
      </div>
    </ShippingZoneFilterProvider>
  )
}
