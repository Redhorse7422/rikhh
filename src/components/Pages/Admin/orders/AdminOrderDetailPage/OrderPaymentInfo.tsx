import React from 'react'
import type { ReactElement } from 'react'

interface OrderPaymentInfoProps {
  paymentDetails: any
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-400',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  failed: 'bg-red-100 text-red-700 border-red-400',
  refunded: 'bg-purple-100 text-purple-700 border-purple-400',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-400',
}

const methodIcons: Record<string, ReactElement> = {
  visa: <span className='inline-block font-bold text-blue-600'>Visa</span>,
  mastercard: <span className='inline-block font-bold text-red-600'>MC</span>,
  paypal: <span className='inline-block font-bold text-blue-700'>PayPal</span>,
  credit_card: <span className='inline-block font-bold text-gray-700'>CC</span>,
  apple_pay: <span className='inline-block font-bold text-black'>Pay</span>,
  google_pay: <span className='inline-block font-bold text-green-600'>GPay</span>,
}

export const OrderPaymentInfo: React.FC<OrderPaymentInfoProps> = ({ paymentDetails }) => {
  if (!paymentDetails) return null

  const {
    paymentStatus,
    paymentMethod,
    paymentTransactionId,
    paymentGatewayResponse,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    totalAmount,
  } = paymentDetails

  // Card/account info
  const accountNumber = paymentGatewayResponse?.transactionResponse?.accountNumber
  const accountType = paymentGatewayResponse?.transactionResponse?.accountType
  const gatewayMessage =
    paymentGatewayResponse?.messages?.message?.[0]?.text ||
    paymentGatewayResponse?.transactionResponse?.messages?.message?.[0]?.description
  const resultCode = paymentGatewayResponse?.messages?.resultCode
  const responseCode = paymentGatewayResponse?.transactionResponse?.responseCode
  const authCode = paymentGatewayResponse?.transactionResponse?.authCode

  // Status badge color
  const statusClass = statusColors[paymentStatus] || 'bg-gray-100 text-gray-700 border-gray-400'
  // Payment method icon
  const methodIcon = methodIcons[paymentMethod?.toLowerCase?.()] || (
    <span className='inline-block font-bold text-gray-700'>{paymentMethod}</span>
  )

  return (
    <div className='mb-6 overflow-hidden rounded-lg border-l-4 border-primary bg-white p-0 shadow-lg'>
      {/* Top bar with status and method */}
      <div className='flex flex-col border-b bg-gradient-to-r from-primary/10 to-blue-50 px-6 py-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass}`}
          >
            {paymentStatus}
          </span>
          <span className='ml-2 flex items-center gap-2 text-sm font-medium'>
            {methodIcon}
            <span className='capitalize'>{paymentMethod?.replace('_', ' ')}</span>
          </span>
        </div>
        {paymentTransactionId && (
          <div className='mt-2 font-mono text-xs text-gray-500 md:mt-0'>Txn: {paymentTransactionId}</div>
        )}
      </div>
      {/* Info grid */}
      <div className='grid grid-cols-1 gap-6 px-6 py-4 md:grid-cols-2'>
        {accountNumber && (
          <div>
            <div className='text-xs text-gray-500'>Card</div>
            <div className='font-medium'>
              {accountType} {accountNumber}
            </div>
          </div>
        )}
        {authCode && (
          <div>
            <div className='text-xs text-gray-500'>Auth Code</div>
            <div className='font-medium'>{authCode}</div>
          </div>
        )}
        {resultCode && (
          <div>
            <div className='text-xs text-gray-500'>Gateway Result</div>
            <div className='font-medium'>{resultCode}</div>
          </div>
        )}
        {responseCode && (
          <div>
            <div className='text-xs text-gray-500'>Response Code</div>
            <div className='font-medium'>{responseCode}</div>
          </div>
        )}
      </div>
      {/* Gateway message */}
      {gatewayMessage && (
        <div className='mx-6 mb-4 rounded border-l-4 border-blue-400 bg-blue-50 px-4 py-2 text-xs text-blue-700 shadow-sm'>
          {gatewayMessage}
        </div>
      )}
      {/* Totals */}
      <div className='flex flex-wrap gap-6 border-t bg-gray-50 px-6 py-4'>
        <div>
          <div className='text-xs text-gray-500'>Payment Subtotal</div>
          <div className='font-semibold'>${Number(subtotal).toFixed(2)}</div>
        </div>
        <div>
          <div className='text-xs text-gray-500'>Tax</div>
          <div className='font-semibold'>${Number(taxAmount).toFixed(2)}</div>
        </div>
        <div>
          <div className='text-xs text-gray-500'>Shipping</div>
          <div className='font-semibold'>${Number(shippingAmount).toFixed(2)}</div>
        </div>
        <div>
          <div className='text-xs text-gray-500'>Discount</div>
          <div className='font-semibold text-green-700'>-${Number(discountAmount).toFixed(2)}</div>
        </div>
        <div className='ml-auto'>
          <div className='text-xs text-gray-500'>Total Paid</div>
          <div className='text-lg font-bold text-primary'>${Number(totalAmount).toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
