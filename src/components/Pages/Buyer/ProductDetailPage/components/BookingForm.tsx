'use client'
import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import { useState } from 'react'

import Image from 'next/image'
import { toast } from 'react-hot-toast'

import { bookingFirebaseService, type Booking } from '@/services/firebase/bookings.firebase'

interface BookingFormProps {
  product: FirebaseProduct
  onClose: () => void
  onSuccess?: (bookingId: string) => void
  userId?: string
}

export default function BookingForm({ product, onClose, onSuccess, userId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    town: '',
    country: '',
    postCode: '',
    bookingDate: '',
    visitBefore: '',
    orderNotes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1
      return Math.max(1, newQuantity) // Minimum quantity is 1
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.phone || !formData.streetAddress) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.bookingDate) {
      toast.error('Please select a booking date')
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData: Omit<Booking, 'id' | 'timestamp'> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        town: formData.town,
        country: formData.country,
        postCode: formData.postCode,
        productId: product.id!,
        productName: product.name,
        productCategory: product.category,
        imageUrl: product.thumbnailImg,
        price: product.regularPrice,
        quantity,
        sellerId: product.sellerId || '',
        userId: userId || '', // Get from auth context
        orderNotes: formData.orderNotes,
        bookingDate: formData.bookingDate,
        visitBefore: formData.visitBefore,
        status: 'pending',
      }

      const bookingId = await bookingFirebaseService.createBooking(bookingData)

      toast.success('Booking submitted successfully! We will contact you soon.')
      onSuccess?.(bookingId)
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white'>
        {/* Header */}
        <div className='flex items-center justify-between border-b p-6'>
          <h2 className='text-xl font-semibold text-gray-900'>Book Now</h2>
          <button onClick={onClose} className='text-gray-400 transition-colors hover:text-gray-600'>
            <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className='border-b bg-gray-50 p-6'>
          <div className='flex items-center space-x-4'>
            <Image
              src={product.thumbnailImg}
              alt={product.name}
              width={150}
              height={150}
              className='h-16 w-16 rounded-lg object-cover'
            />
            <div>
              <h3 className='font-medium text-gray-900'>{product.name}</h3>
              <p className='text-sm text-gray-600'>{product.category}</p>
              <p className='text-lg font-semibold text-primary'>₹{product.regularPrice}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6 p-6'>
          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Personal Information</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>First name*</label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Last name</label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Booking Details</h3>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Booking Date*</label>
              <div className='relative'>
                <input
                  type='date'
                  name='bookingDate'
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Will visit store before</label>
              <div className='relative'>
                <input
                  type='time'
                  name='visitBefore'
                  value={formData.visitBefore}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Address Information</h3>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Street address*</label>
              <input
                type='text'
                name='streetAddress'
                value={formData.streetAddress}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Town/City</label>
                <input
                  type='text'
                  name='town'
                  value={formData.town}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>State/Country</label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Pincode</label>
              <input
                type='text'
                name='postCode'
                value={formData.postCode}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Contact Information</h3>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Phone*</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Email address*</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Quantity</h3>

            <div className='flex items-center space-x-4'>
              <button
                type='button'
                onClick={() => handleQuantityChange(false)}
                className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-primary'
              >
                <svg className='h-5 w-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                </svg>
              </button>

              <span className='min-w-[2rem] text-center text-xl font-semibold text-gray-900'>{quantity}</span>

              <button
                type='button'
                onClick={() => handleQuantityChange(true)}
                className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-primary'
              >
                <svg className='h-5 w-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Additional Information</h3>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Order Notes</label>
              <textarea
                name='orderNotes'
                value={formData.orderNotes}
                onChange={handleInputChange}
                rows={3}
                className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='Any special instructions or requirements...'
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='hover:bg-primary-dark w-full rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
