'use client'
import type { Order, OrderStats } from '@/types/order'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'
import { getOrderStats, getOrders } from '@/services/order.services'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const AdminOrdersPage = () => {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [search, setSearch] = useState('')
  const router = useRouter()

  // Fetch stats
  useEffect(() => {
    setStatsLoading(true)
    getOrderStats()
      .then((res) => setStats(res.data))
      .finally(() => setStatsLoading(false))
  }, [])

  // Table columns
  const columns = [
    {
      header: 'Order #',
      key: 'orderNumber',
      render: (orderNumber: string) => <span className='font-medium text-gray-900'>{orderNumber}</span>,
    },
    {
      header: 'Customer',
      key: 'customerEmail',
      render: (_: any, order: Order) => (
        <div className='text-sm text-gray-900'>
          {order.customerFirstName} {order.customerLastName}
          <br />
          <span className='text-xs text-gray-500'>{order.customerEmail}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (status: string) => {
        const statusClasses: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800',
          confirmed: 'bg-blue-100 text-blue-800',
          shipped: 'bg-indigo-100 text-indigo-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
        }

        const baseClass = 'inline-flex rounded-full px-2 py-1 text-xs font-semibold '
        const className = baseClass + (statusClasses[status] ?? 'bg-gray-100 text-gray-800')

        return <span className={className}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      },
    },
    {
      header: 'Total',
      key: 'totalAmount',
      render: (totalAmount: number) => (
        <span className='font-medium text-gray-900'>${Number(totalAmount).toFixed(2)}</span>
      ),
    },
    {
      header: 'Date',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className='text-sm text-gray-600'>{new Date(createdAt).toLocaleString()}</span>
      ),
    },
    // Optionally add actions column here
  ]

  return (
    <div className='flex flex-col gap-y-6'>
      {/* Order Stats Cards */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Total Orders</div>
          <div className='text-2xl font-bold text-gray-900'>{statsLoading ? '...' : (stats?.totalOrders ?? 0)}</div>
        </Card>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Pending</div>
          <div className='text-2xl font-bold text-yellow-600'>{statsLoading ? '...' : (stats?.pending ?? 0)}</div>
        </Card>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Confirmed</div>
          <div className='text-2xl font-bold text-blue-600'>{statsLoading ? '...' : (stats?.confirmed ?? 0)}</div>
        </Card>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Shipped</div>
          <div className='text-2xl font-bold text-indigo-600'>{statsLoading ? '...' : (stats?.shipped ?? 0)}</div>
        </Card>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Delivered</div>
          <div className='text-2xl font-bold text-green-600'>{statsLoading ? '...' : (stats?.delivered ?? 0)}</div>
        </Card>
        <Card className='col-span-1'>
          <div className='text-xs text-gray-500'>Cancelled</div>
          <div className='text-2xl font-bold text-red-600'>{statsLoading ? '...' : (stats?.cancelled ?? 0)}</div>
        </Card>
        <Card className='col-span-2'>
          <div className='text-xs text-gray-500'>Total Revenue</div>
          <div className='text-2xl font-bold text-gray-900'>
            {statsLoading
              ? '...'
              : `$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}`}
          </div>
        </Card>
      </div>

      {/* Filter/Search Bar */}
      <Card className='p-4'>
        <form
          className='flex flex-col gap-4 md:flex-row md:items-end md:gap-6'
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div>
            <label className='mb-1 block text-xs font-medium text-gray-700'>Status</label>
            <select
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value)
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className='mb-1 block text-xs font-medium text-gray-700'>Search</label>
            <input
              type='text'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              placeholder='Search by customer email, order number...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type='submit' label='Apply Filters' className='self-end' />
        </form>
      </Card>

      {/* Orders Table */}
      <Card className='p-0 px-0 py-0'>
        <SmartPaginatedTable
          path='/v1/orders'
          columns={columns as any}
          initialQuery={{ newStatus, search }}
          onRowClick={(row) => {
            if (row.id) {
              router.push(`/orders/${row.id}`)
            }
          }}
        />
      </Card>
    </div>
  )
}
