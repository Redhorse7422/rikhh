// Order Management Types

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  selectedVariants: Array<{ name: string; value: string }>
}

export interface StatusHistory {
  status: OrderStatus
  updatedAt: string
  notes?: string
}

export interface Address {
  firstName: string
  lastName: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  guestId?: string | null
  status: OrderStatus
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  paymentStatus: PaymentStatus
  paymentMethod: string
  createdAt: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
}

export interface OrderDetail extends Order {
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  statusHistory: StatusHistory[]
  paymentDetails?: any // TODO: type this more strictly if possible
}

export interface OrderListResponse {
  success: boolean
  data: {
    orders: Order[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface OrderDetailResponse {
  success: boolean
  data: OrderDetail
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  notes?: string
}

export interface UpdateOrderStatusResponse {
  success: boolean
  data: {
    id: string
    orderNumber: string
    status: OrderStatus
    statusHistory: StatusHistory[]
  }
}

export interface DeleteOrderResponse {
  success: boolean
  message: string
}

export interface OrderStats {
  totalOrders: number
  pending: number
  confirmed: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
}

export interface OrderStatsResponse {
  success: boolean
  data: OrderStats
}
