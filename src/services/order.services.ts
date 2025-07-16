import type {
  OrderListResponse,
  OrderDetailResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  DeleteOrderResponse,
  OrderStatsResponse,
} from '@/types/order'

import { client } from '@/libs/axios'

export const getOrders = async (params: Record<string, any> = {}): Promise<OrderListResponse> => {
  const searchParams = new URLSearchParams(params)
  const response = await client.get(`/v1/checkout/orders?${searchParams.toString()}`)
  return response.data
}

export const getOrderById = async (orderId: string): Promise<OrderDetailResponse> => {
  const response = await client.get(`/v1/orders/${orderId}`)
  return response as any
}

export const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusRequest,
): Promise<UpdateOrderStatusResponse> => {
  const response = await client.put(`/v1/orders/${orderId}/status`, data)
  return response as any
}

export const deleteOrder = async (orderId: string): Promise<DeleteOrderResponse> => {
  const response = await client.delete(`/v1/checkout/orders/${orderId}`)
  return response.data
}

export const getOrderStats = async (): Promise<OrderStatsResponse> => {
  const response = await client.get('/v1/orders/stats')
  return response as any
}
