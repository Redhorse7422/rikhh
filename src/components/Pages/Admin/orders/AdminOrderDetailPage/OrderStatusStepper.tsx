import type { StatusHistory } from '@/types/order'

import React from 'react'

export enum ORDER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  RETURNED = 'returned',
}

const STATUS_LABELS: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded',
  [ORDER_STATUS.RETURNED]: 'Returned',
}

const MAIN_FLOW: ORDER_STATUS[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
]

const TERMINAL_STATUSES: ORDER_STATUS[] = [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED, ORDER_STATUS.RETURNED]

interface OrderStatusStepperProps {
  currentStatus: ORDER_STATUS
  statusHistory: StatusHistory[]
}

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ currentStatus, statusHistory }) => {
  const historyMap = Object.fromEntries(statusHistory.map((h) => [h.status, h])) as Record<string, StatusHistory>
  const currentIdx = MAIN_FLOW.indexOf(currentStatus as ORDER_STATUS)
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus as ORDER_STATUS)

  // Progress bar width (for completed steps)
  const progressPercent = isTerminal
    ? ((MAIN_FLOW.length - 1) / (MAIN_FLOW.length - 1)) * 100
    : (currentIdx / (MAIN_FLOW.length - 1)) * 100

  return (
    <div className='mb-8 w-full'>
      <div className='mb-4 font-semibold'>Order Progress</div>
      <div className='relative w-full px-2 md:px-0'>
        {/* Progress bar background */}
        <div className='absolute left-0 top-1/2 z-0 h-2 w-full -translate-y-1/2 rounded bg-gray-200 md:h-2' />
        {/* Progress bar foreground */}
        <div
          className='absolute left-0 top-1/2 z-10 h-2 rounded bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 md:h-2'
          style={{ width: `${progressPercent}%`, maxWidth: '100%', transform: 'translateY(-50%)' }}
        />
        <ol className='relative z-20 flex w-full flex-col items-start justify-between md:flex-row md:items-center'>
          {MAIN_FLOW.map((status, idx) => {
            const completed = idx < currentIdx || (isTerminal && idx < currentIdx)
            const isCurrent = idx === currentIdx && !isTerminal
            const history = historyMap[status]
            return (
              <li
                key={status}
                className='flex w-full flex-row items-center md:w-auto md:flex-1 md:flex-col md:items-center'
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-lg transition-colors duration-300 ${completed ? 'border-green-400 bg-green-500 text-white' : isCurrent ? 'border-blue-400 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}
                >
                  {completed ? (
                    <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={3} viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                    </svg>
                  ) : isCurrent ? (
                    <span className='block h-6 w-6 rounded-full bg-blue-500' />
                  ) : (
                    <span className='font-bold'>{idx + 1}</span>
                  )}
                </div>
                <div className='ml-3 flex flex-col md:ml-0 md:mt-3 md:items-center'>
                  <span
                    className={`text-xs font-semibold ${completed ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                  {history && (
                    <span className='mt-1 text-xs text-gray-400'>{new Date(history.updatedAt).toLocaleString()}</span>
                  )}
                </div>
                {/* Connector for mobile vertical */}
                {idx < MAIN_FLOW.length - 1 && <div className='block h-8 w-0.5 bg-gray-300 md:hidden' />}
              </li>
            )
          })}
          {/* Terminal status (if reached) */}
          {isTerminal && (
            <li className='flex w-full flex-row items-center md:w-auto md:flex-1 md:flex-col md:items-center'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full border-4 border-red-400 bg-red-500 text-white shadow-lg'>
                <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={3} viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <div className='ml-3 flex flex-col md:ml-0 md:mt-3 md:items-center'>
                <span className='text-xs font-semibold text-red-700'>
                  {STATUS_LABELS[currentStatus as ORDER_STATUS]}
                </span>
                {historyMap[currentStatus] && (
                  <span className='mt-1 text-xs text-gray-400'>
                    {new Date(historyMap[currentStatus].updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}
