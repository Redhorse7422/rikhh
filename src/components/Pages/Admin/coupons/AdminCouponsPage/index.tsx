'use client'

import { Suspense } from 'react'

import { CouponFilterProvider } from './CouponFilterContext'
import { SectionCoupons } from './SectionCoupons'
import { SectionFilter } from './SectionFilter'

export const AdminCouponsPage = () => {
  return (
    <CouponFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <Suspense fallback={<div>Loading filters...</div>}>
          <SectionFilter />
        </Suspense>
        <Suspense fallback={<div>Loading coupons...</div>}>
          <SectionCoupons />
        </Suspense>
      </div>
    </CouponFilterProvider>
  )
}
