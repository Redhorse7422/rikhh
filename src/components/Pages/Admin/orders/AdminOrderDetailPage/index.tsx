import type { ORDER_STATUS } from './OrderStatusStepper'
import type { OrderDetail, OrderStatus } from '@/types/order'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { getOrderById, updateOrderStatus, deleteOrder } from '@/services/order.services'

import { OrderAddresses } from './OrderAddresses'
import { OrderCustomerInfo } from './OrderCustomerInfo'
import { OrderHeader } from './OrderHeader'
import { OrderItemsTable } from './OrderItemsTable'
import { OrderPaymentInfo } from './OrderPaymentInfo'
import { OrderStatusHistory } from './OrderStatusHistory'
import { OrderStatusSection } from './OrderStatusSection'
import { OrderStatusStepper } from './OrderStatusStepper'
import { OrderTotals } from './OrderTotals'

interface AdminOrderDetailPageProps {
  orderId: string
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const AdminOrderDetailPage: React.FC<AdminOrderDetailPageProps> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [statusNotes, setStatusNotes] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    setError(null)
    getOrderById(orderId)
      .then((res) => {
        setOrder(res.data)
        setStatus(res.data.status)
      })
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false))
  }, [orderId])

  const handleStatusUpdate = async () => {
    if (!order) return
    setStatusLoading(true)
    setStatusSuccess(null)
    setStatusError(null)
    try {
      const res = await updateOrderStatus(order.id, { status, notes: statusNotes })
      setOrder((prev) => (prev ? { ...prev, status: res.data.status, statusHistory: res.data.statusHistory } : prev))
      setStatusSuccess('Order status updated successfully.')
      setStatusNotes('')
    } catch (e) {
      setStatusError('Failed to update order status.')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!order) return
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteOrder(order.id)
      router.push('/admin/orders')
    } catch (e) {
      setDeleteError('Failed to delete order.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className='p-8 text-center'>Loading order details...</div>
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>
  if (!order) return null

  return (
    <div className='mx-auto rounded bg-white p-6 shadow'>
      <OrderHeader
        orderNumber={order.orderNumber}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
      <OrderStatusSection
        status={status}
        statusOptions={statusOptions}
        statusNotes={statusNotes}
        onStatusChange={setStatus}
        onNotesChange={setStatusNotes}
        onSave={handleStatusUpdate}
        loading={statusLoading}
        disabled={statusLoading}
        feedback={{ success: statusSuccess, error: statusError }}
        currentStatus={order.status}
      />
      <OrderStatusStepper currentStatus={order.status as ORDER_STATUS} statusHistory={order.statusHistory} />
      <div className='mb-4 text-sm text-gray-600'>
        <span>Placed: {new Date(order.createdAt).toLocaleString()}</span>
      </div>
      {/* <OrderStatusHistory statusHistory={order.statusHistory} /> */}
      <OrderCustomerInfo
        customerFirstName={order.customerFirstName}
        customerLastName={order.customerLastName}
        customerEmail={order.customerEmail}
      />
      <OrderAddresses shippingAddress={order.shippingAddress} billingAddress={order.billingAddress} />
      <OrderItemsTable items={order.items} />
      <OrderPaymentInfo paymentDetails={order.paymentDetails} />
      <OrderTotals
        subtotal={order.subtotal}
        taxAmount={order.taxAmount}
        shippingAmount={order.shippingAmount}
        discountAmount={order.discountAmount}
        totalAmount={order.totalAmount}
      />
    </div>
  )
}
