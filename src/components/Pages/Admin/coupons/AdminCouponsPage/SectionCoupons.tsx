'use client'

import { useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import DeleteConfirmationModal from '@/components/common/Modal/DeleteConfirmationModal'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { downloadCouponExport } from '@/services/coupon.services'

import { useCouponFilter } from './CouponFilterContext'
import { useColumn } from './useColumn'

export const SectionCoupons = () => {
  const router = useRouter()
  const { filters } = useCouponFilter()
  const { showToast } = useToast()
  const { removeDataSource } = useApi()
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const tableRef = useRef<{ refetch: () => void }>(null)

  // Clean filters to remove empty strings and undefined values
  const cleanFilters = (filterValues: any) => {
    const cleaned: any = {}
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key]
      if (value !== '' && value !== undefined && value !== null) {
        cleaned[key] = value
      }
    })
    return cleaned
  }

  const handleDeleteCoupon = (couponId: string) => {
    setSelectedCouponId(couponId)
    setIsDeleteModalOpen(true)
  }

  const { columns } = useColumn(handleDeleteCoupon)

  const handleExportCSV = async () => {
    try {
      await downloadCouponExport(cleanFilters(filters))
      showToast('Coupons exported successfully!', 'success')
    } catch (error) {
      console.error('Error exporting coupons:', error)
      showToast('Failed to export coupons. Please try again.', 'error')
    }
  }

  const handleAddCoupon = () => {
    router.push('/coupons/add')
  }

  const handleConfirmDelete = async () => {
    if (!selectedCouponId) return

    try {
      await removeDataSource.mutateAsync({
        path: '/v1/coupons',
        id: selectedCouponId,
      })
      showToast('Coupon deleted successfully!', 'success')
      setIsDeleteModalOpen(false)
      setSelectedCouponId(null)
      tableRef.current?.refetch()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      showToast('Failed to delete coupon. Please try again.', 'error')
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedCouponId(null)
  }

  return (
    <>
      <Card>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-medium text-gray-900'>Coupons</h2>
          <div className='flex gap-3'>
            <Button label='Export CSV' variant='outlinePrimary' onClick={handleExportCSV} />
            <Button label='Bulk Create' variant='outlinePrimary' onClick={() => router.push('/coupons/bulk')} />
            <Button label='Add Coupon' onClick={handleAddCoupon} />
          </div>
        </div>

        <SmartPaginatedTable
          ref={tableRef}
          path='/v1/coupons'
          columns={columns as any}
          initialQuery={{
            sort: '-createdAt',
            ...cleanFilters(filters),
          }}
        />
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Delete Coupon'
        description='Are you sure you want to delete this coupon? This action cannot be undone.'
      />
    </>
  )
}
