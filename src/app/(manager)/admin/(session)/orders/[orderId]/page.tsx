'use client'

import { useParams } from 'next/navigation'

import { AdminOrderDetailPage } from '@/components/Pages/Admin/orders/AdminOrderDetailPage'

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params?.orderId as string

  return <AdminOrderDetailPage orderId={orderId} />
}
