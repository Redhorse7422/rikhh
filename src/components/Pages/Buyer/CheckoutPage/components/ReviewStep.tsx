import React from 'react'

import { Button } from '@/components/common/Button'

import { useCheckout } from '../context/CheckoutContext'

import { CheckoutSummary } from './CheckoutSummary'

export const ReviewStep: React.FC = () => {
  const { checkoutData, onStepChange, onCompleteOrder, isProcessing } = useCheckout()

  const handleBack = () => {
    onStepChange('payment')
  }

  return (
    <div className='space-y-6'>
      <div className='rounded bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold'>Shipping Info</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <b>Name:</b> {checkoutData.shipping.firstName} {checkoutData.shipping.lastName}
          </div>
          <div>
            <b>Email:</b> {checkoutData.shipping.email}
          </div>
          <div>
            <b>Phone:</b> {checkoutData.shipping.phone}
          </div>
          <div>
            <b>Address:</b> {checkoutData.shipping.address}, {checkoutData.shipping.city}, {checkoutData.shipping.state}
            , {checkoutData.shipping.zipCode}, {checkoutData.shipping.country}
          </div>
        </div>
      </div>
      <div className='rounded bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold'>Billing Info</h3>
        {checkoutData.billing.sameAsShipping ? (
          <div>Same as shipping address</div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <b>Name:</b> {checkoutData.billing.firstName} {checkoutData.billing.lastName}
            </div>
            <div>
              <b>Email:</b> {checkoutData.billing.email}
            </div>
            <div>
              <b>Phone:</b> {checkoutData.billing.phone}
            </div>
            <div>
              <b>Address:</b> {checkoutData.billing.address}, {checkoutData.billing.city}, {checkoutData.billing.state},{' '}
              {checkoutData.billing.zipCode}, {checkoutData.billing.country}
            </div>
          </div>
        )}
      </div>
      <div className='rounded bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold'>Payment Info</h3>
        <div>
          <b>Method:</b> {checkoutData.payment.method}
        </div>
        {checkoutData.payment.method === 'card' && (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <b>Cardholder Name:</b> {checkoutData.payment.cardHolderName}
            </div>
            <div>
              <b>Card Number:</b> **** **** **** {checkoutData.payment.cardNumber.slice(-4)}
            </div>
          </div>
        )}
      </div>
      <CheckoutSummary />
      <div className='flex justify-between'>
        <Button type='button' onClick={handleBack} label='Back'>
          Back
        </Button>
        <Button type='button' onClick={onCompleteOrder} loading={isProcessing} label='Place Order'>
          Place Order
        </Button>
      </div>
    </div>
  )
}
