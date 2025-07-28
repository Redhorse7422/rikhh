import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
// import { useCart } from '@/contexts/CartContext'

import { useCheckout } from '../context/CheckoutContext'

export const ConfirmationStep: React.FC = () => {
  const router = useRouter()
  const { orderResponse } = useCheckout()
  // const { fetchCart } = useCart()
  const [showError, setShowError] = useState(false)
  console.log('Order Response  ==> ', orderResponse)
  // Error state: missing or malformed orderResponse
  if (!orderResponse || !orderResponse.data || !orderResponse.data.order) {
    // If orderResponse exists but is malformed, show error
    if (orderResponse && (!orderResponse.data || !orderResponse.data.order)) {
      return (
        <div className='space-y-8'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
              <svg className='h-8 w-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </div>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Order Confirmation Failed</h1>
            <p className='text-lg text-gray-600'>
              We were unable to retrieve your order details. Please check your email for confirmation or contact
              support.
            </p>
            <button
              className='mt-6 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90'
              onClick={() => router.push('/')}
            >
              Return to Shop
            </button>
          </div>
        </div>
      )
    }
    // Still waiting for order response (spinner)
    return (
      <div className='space-y-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Processing Order...</h1>
          <p className='text-lg text-gray-600'>Please wait while we confirm your order details.</p>
        </div>
      </div>
    )
  }

  const orderData = orderResponse

  const handleContinueShopping = async () => {
    // await fetchCart()
    router.push('/')
  }

  const handleViewOrders = async () => {
    // await fetchCart()
    router.push('/orders')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-purple-600 bg-purple-100'
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className='space-y-8'>
      {/* Success Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <svg className='h-8 w-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>Order Confirmed!</h1>
        <p className='text-lg text-gray-600'>Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      {/* Order Details Card */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 flex items-center justify-between border-b border-gray-200 pb-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Order Details</h2>
            <p className='text-sm text-gray-600'>Order #{orderData.data.order.orderNumber}</p>
          </div>
          <div className='text-right'>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(orderData.data.order.status)}`}
            >
              {orderData.data.order.status.charAt(0).toUpperCase() + orderData.data.order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Order Date</h3>
            <p className='text-sm text-gray-900'>{formatDate(orderData.data.order.createdAt)}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Total Amount</h3>
            <p className='text-lg font-semibold text-gray-900'>${orderData.data.order.totalAmount.toFixed(2)}</p>
          </div>
          {orderData.data.order.trackingNumber && (
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Tracking Number</h3>
              <p className='text-sm text-gray-900'>{orderData.data.order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className='mb-6'>
          <h3 className='mb-4 text-lg font-medium text-gray-900'>Items Ordered</h3>
          <div className='space-y-4'>
            {orderData.data.order.items.map((item: any) => (
              <div key={item.id} className='flex items-center justify-between rounded-lg border border-gray-200 p-4'>
                <div className='flex-1'>
                  <h4 className='font-medium text-gray-900'>{item.productName}</h4>
                  <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                  {item.selectedVariants.length > 0 && (
                    <div className='mt-1'>
                      {item.selectedVariants.map((variant: any) => (
                        <span
                          key={variant.attributeValueId}
                          className='mr-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700'
                        >
                          {variant.attributeName}: {variant.attributeValue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className='text-right'>
                  <p className='font-medium text-gray-900'>${Number(item.totalPrice).toFixed(2)}</p>
                  <p className='text-sm text-gray-600'>${Number(item.unitPrice).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className='mb-6'>
          <h3 className='mb-4 text-lg font-medium text-gray-900'>Shipping Address</h3>
          <div className='rounded-lg border border-gray-200 p-4'>
            <p className='font-medium text-gray-900'>
              {orderData.data.order.shippingAddress.firstName} {orderData.data.order.shippingAddress.lastName}
            </p>
            <p className='text-gray-600'>
              {orderData.data.order.shippingAddress.addressLine1}
              {orderData.data.order.shippingAddress.addressLine2 &&
                `, ${orderData.data.order.shippingAddress.addressLine2}`}
            </p>
            <p className='text-gray-600'>
              {orderData.data.order.shippingAddress.city}, {orderData.data.order.shippingAddress.state}{' '}
              {orderData.data.order.shippingAddress.postalCode}
            </p>
            <p className='text-gray-600'>{orderData.data.order.shippingAddress.country}</p>
            <p className='text-gray-600'>{orderData.data.order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className='mb-6'>
          <h3 className='mb-4 text-lg font-medium text-gray-900'>Payment Information</h3>
          <div className='rounded-lg border border-gray-200 p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-gray-900'>
                  {orderData.data.paymentReceipt.paymentMethod
                    .replace('_', ' ')
                    .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                </p>
                <p className='text-sm text-gray-600'>Transaction ID: {orderData.data.paymentReceipt.transactionId}</p>
              </div>
              <div className='text-right'>
                <p className='font-medium text-gray-900'>${orderData.data.paymentReceipt.amount.toFixed(2)}</p>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(orderData.data.paymentReceipt.status)}`}
                >
                  {orderData.data.paymentReceipt.status.charAt(0).toUpperCase() +
                    orderData.data.paymentReceipt.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        {orderData.data.emailSent && (
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <div className='flex items-center'>
              <svg className='h-5 w-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <p className='ml-2 text-sm text-blue-700'>
                A confirmation email has been sent to {orderData.data.order.shippingAddress.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
        <Button
          onClick={handleContinueShopping}
          label='Continue Shopping'
          className='flex-1 bg-primary text-white hover:bg-primary/90'
        >
          Continue Shopping
        </Button>
        <Button
          onClick={handleViewOrders}
          label='View My Orders'
          className='flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        >
          View My Orders
        </Button>
      </div>
    </div>
  )
}
