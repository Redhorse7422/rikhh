'use client'
import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import { useEffect } from 'react'

interface BookingConfirmationProps {
  product: FirebaseProduct
  bookingId: string
  onClose: () => void
}

export default function BookingConfirmation({ product, bookingId, onClose }: BookingConfirmationProps) {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-6'>
        {/* Success Icon */}
        <div className='mb-6 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <svg className='h-8 w-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className='mb-6 text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>Booking Confirmed!</h2>
          <p className='text-gray-600'>
            Your booking has been submitted successfully. We will contact you soon to confirm the details.
          </p>
        </div>

        {/* Booking Details */}
        <div className='mb-6 rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-3 font-semibold text-gray-900'>Booking Details</h3>

          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Booking ID:</span>
              <span className='font-medium text-gray-900'>{bookingId}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Product:</span>
              <span className='font-medium text-gray-900'>{product.name}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Price:</span>
              <span className='font-medium text-gray-900'>₹{product.regularPrice}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Status:</span>
              <span className='font-medium text-green-600'>Pending</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className='mb-6 flex items-center space-x-4 rounded-lg border p-4'>
          <img src={product.thumbnailImg} alt={product.name} className='h-12 w-12 rounded-lg object-cover' />
          <div>
            <h4 className='font-medium text-gray-900'>{product.name}</h4>
            <p className='text-sm text-gray-600'>{product.category}</p>
          </div>
        </div>

        {/* Next Steps */}
        {/* <div className='mb-6 rounded-lg bg-blue-50 p-4'>
          <h4 className='mb-2 font-semibold text-blue-900'>What's Next?</h4>
          <ul className='space-y-1 text-sm text-blue-800'>
            <li>• We'll review your booking within 24 hours</li>
            <li>• You'll receive a confirmation call or email</li>
            <li>• Visit our store on the selected date</li>
            <li>• Bring your booking ID for reference</li>
          </ul>
        </div> */}

        {/* Action Buttons */}
        <div className='flex space-x-3'>
          <button
            onClick={onClose}
            className='hover:bg-primary-dark flex-1 rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors'
          >
            Continue Shopping
          </button>

          <button
            onClick={() => {
              // TODO: Navigate to bookings page or user dashboard
              onClose()
            }}
            className='flex-1 rounded-md bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300'
          >
            View Bookings
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
    </div>
  )
}
