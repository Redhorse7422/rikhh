import React from 'react'

import { useCheckout } from '../context/CheckoutContext'

import { CheckoutSummary } from './CheckoutSummary'

export const ConfirmationStep: React.FC = () => {
  const { checkoutData } = useCheckout()
  return (
    <div className='space-y-6'>
      <div className='rounded bg-white p-6 text-center shadow'>
        <h2 className='mb-2 text-2xl font-bold text-primary'>Thank you for your order!</h2>
        <p className='mb-4'>
          Your order has been placed successfully. A confirmation email will be sent to{' '}
          <b>{checkoutData.shipping.email}</b>.
        </p>
        <p className='mb-2'>We appreciate your business!</p>
      </div>
      <CheckoutSummary />
      <div className='text-center text-gray-600'>
        <p>
          Need help?{' '}
          <a href='/contact' className='text-primary underline'>
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
