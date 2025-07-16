'use client'

import type { Coupon } from '@/types/coupon'

import { Button } from '@/components/common/Button'
import { useNavigate } from '@/hooks/useNavigate'
import { formatCouponValue, getCouponTypeDisplayName, getCouponUsagePercentage } from '@/services/coupon.services'

export const useColumn = (onDelete?: (couponId: string) => void) => {
  const router = useNavigate()

  const handleEdit = (coupon: Coupon) => {
    router.rPush(`/${coupon.id}/edit`)
  }

  const handleDelete = (coupon: Coupon) => {
    onDelete?.(coupon.id)
  }

  const renderUsage = (coupon: Coupon) => {
    if (coupon.usageLimit === null) {
      return <span className='text-sm text-gray-600'>Unlimited ({coupon.usageCount} used)</span>
    }

    const percentage = getCouponUsagePercentage(coupon)

    return (
      <div className='flex flex-col'>
        <span className='text-sm font-medium'>
          {coupon.usageCount} / {coupon.usageLimit}
        </span>
        <div className='mt-1 h-1 w-full rounded-full bg-gray-200'>
          <div className='h-1 rounded-full bg-blue-500' style={{ width: `${percentage}%` }} />
        </div>
      </div>
    )
  }

  const renderStatus = (coupon: Coupon) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)

    let status = 'Active'
    let badgeClass = 'bg-green-100 text-green-800'

    if (!coupon.isActive) {
      status = 'Inactive'
      badgeClass = 'bg-gray-100 text-gray-800'
    } else if (now < validFrom) {
      status = 'Scheduled'
      badgeClass = 'bg-blue-100 text-blue-800'
    } else if (now > validUntil) {
      status = 'Expired'
      badgeClass = 'bg-red-100 text-red-800'
    } else if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      status = 'Used Up'
      badgeClass = 'bg-yellow-100 text-yellow-800'
    }

    return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}>{status}</span>
  }

  const renderActions = (coupon: Coupon) => {
    return (
      <div className='flex gap-2'>
        <Button label='Edit' variant='outlinePrimary' onClick={() => handleEdit(coupon)} className='text-xs' />
        {onDelete && (
          <Button label='Delete' variant='outlineDark' onClick={() => handleDelete(coupon)} className='text-xs' />
        )}
      </div>
    )
  }

  return {
    columns: [
      {
        header: 'Code',
        key: 'code',
        isSort: true,
        render: (code: string) => <span className='font-medium text-gray-900'>{code}</span>,
      },
      {
        header: 'Type',
        key: 'type',
        isSort: true,
        render: (type: string) => (
          <span className='text-sm text-gray-900'>{getCouponTypeDisplayName(type as any)}</span>
        ),
      },
      {
        header: 'Value',
        key: 'value',
        isSort: true,
        render: (value: number, coupon: Coupon) => (
          <span className='text-sm font-medium text-gray-900'>{formatCouponValue(coupon)}</span>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        isSort: false,
        render: (status: string, coupon: Coupon) => renderStatus(coupon),
      },
      {
        header: 'Usage',
        key: 'usage',
        isSort: true,
        render: (usage: any, coupon: Coupon) => renderUsage(coupon),
      },
      {
        header: 'Valid From',
        key: 'validFrom',
        isSort: true,
        render: (validFrom: string) => (
          <span className='text-sm text-gray-600'>{new Date(validFrom).toLocaleDateString()}</span>
        ),
      },
      {
        header: 'Valid Until',
        key: 'validUntil',
        isSort: true,
        render: (validUntil: string) => (
          <span className='text-sm text-gray-600'>{new Date(validUntil).toLocaleDateString()}</span>
        ),
      },
      {
        header: 'Actions',
        key: 'actions',
        isSort: false,
        render: (actions: any, coupon: Coupon) => renderActions(coupon),
      },
    ],
  }
}
