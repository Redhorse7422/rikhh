'use client'

import type { CouponStats } from '@/types/coupon'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { FullScreenLoading } from '@/components/common/Loading/FullScreenLoading'
import { useApi } from '@/hooks/useApi'
import { Grid, GridItem } from '@/libs/pureTailwind'

export const AdminCouponStatsPage = () => {
  const router = useRouter()
  const { getDataSource } = useApi()

  // Fetch coupon statistics
  const {
    data: statsData,
    isLoading,
    error,
  } = getDataSource({
    path: '/v1/coupons/stats',
  })

  if (isLoading) {
    return <FullScreenLoading />
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card>
          <div className='p-6 text-center'>
            <h2 className='mb-2 text-lg font-semibold text-red-600'>Error Loading Statistics</h2>
            <p className='text-gray-600'>Failed to load coupon statistics. Please try again.</p>
            <Button
              label='Back to Coupons'
              variant='outlinePrimary'
              onClick={() => router.push('/coupons')}
              className='mt-4'
            />
          </div>
        </Card>
      </div>
    )
  }

  const stats: CouponStats = (statsData?.data as unknown as CouponStats) || {
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
    totalDiscountGiven: 0,
    topCoupons: [],
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>Coupon Statistics</h1>
        <Button label='Back to Coupons' variant='outlinePrimary' onClick={() => router.push('/coupons')} />
      </div>

      {/* Overview Cards */}
      <Grid col={{ default: 1, md: 2, lg: 4 }} rowGap={6} colGap={6}>
        <GridItem>
          <Card>
            <div className='p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white'>
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='truncate text-sm font-medium text-gray-500'>Total Coupons</dt>
                    <dd className='text-lg font-medium text-gray-900'>{stats.totalCoupons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <div className='p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white'>
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='truncate text-sm font-medium text-gray-500'>Active Coupons</dt>
                    <dd className='text-lg font-medium text-gray-900'>{stats.activeCoupons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <div className='p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white'>
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='truncate text-sm font-medium text-gray-500'>Expired Coupons</dt>
                    <dd className='text-lg font-medium text-gray-900'>{stats.expiredCoupons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <div className='p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white'>
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='truncate text-sm font-medium text-gray-500'>Total Usage</dt>
                    <dd className='text-lg font-medium text-gray-900'>{stats.totalUsage}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        </GridItem>
      </Grid>

      {/* Financial Impact */}
      <Card>
        <div className='p-6'>
          <h2 className='mb-4 text-lg font-medium text-gray-900'>Financial Impact</h2>
          <div className='flex items-center justify-center rounded-lg bg-gray-50 p-8'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600'>${stats.totalDiscountGiven.toLocaleString()}</div>
              <div className='mt-2 text-sm text-gray-600'>Total Discount Given</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Performing Coupons */}
      <Card>
        <div className='p-6'>
          <h2 className='mb-4 text-lg font-medium text-gray-900'>Top Performing Coupons</h2>
          {stats.topCoupons.length > 0 ? (
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
                    >
                      Coupon Code
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
                    >
                      Usage Count
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
                    >
                      Total Discount
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {stats.topCoupons.map((coupon, index) => (
                    <tr key={coupon.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>{coupon.code}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>{coupon.usageCount}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        ${coupon.totalDiscount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='py-12 text-center'>
              <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No coupon usage data</h3>
              <p className='mt-1 text-sm text-gray-500'>
                Get started by creating and sharing coupons with your customers.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-center gap-4'>
        <Button label='View All Coupons' variant='outlinePrimary' onClick={() => router.push('/coupons')} />
        <Button label='Create New Coupon' onClick={() => router.push('/coupons/add')} />
      </div>
    </div>
  )
}
