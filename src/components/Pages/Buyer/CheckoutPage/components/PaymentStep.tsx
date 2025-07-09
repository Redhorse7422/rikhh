import React, { useState } from 'react'

import { TextInput } from '@/components/FormElements/TextInput/TextInput'
import { Button } from '@/components/common/Button'

import { useCheckout } from '../context/CheckoutContext'

const paymentMethods = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'apple-pay', label: 'Apple Pay' },
  { value: 'google-pay', label: 'Google Pay' },
]

export const PaymentStep: React.FC = () => {
  const { checkoutData, onDataUpdate, onStepChange } = useCheckout()
  const [form, setForm] = useState(checkoutData.payment)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (
      form.method === 'card' &&
      (!form.cardNumber || !form.cardHolderName || !form.expiryMonth || !form.expiryYear || !form.cvv)
    ) {
      setError('Please fill in all required card fields.')
      return
    }
    setError(null)
    onDataUpdate('payment', form)

    // Move to review step (checkout already initiated on mount)
    onStepChange('review')
  }

  const handleBack = () => {
    onStepChange('shipping-method')
  }

  return (
    <form
      className='space-y-4'
      onSubmit={(e) => {
        e.preventDefault()
        handleNext()
      }}
    >
      <div className='mb-4'>
        <label className='mb-2 block font-medium'>Payment Method</label>
        <div className='flex gap-4'>
          {paymentMethods.map((pm) => (
            <label key={pm.value} className='flex items-center gap-2'>
              <input
                type='radio'
                name='paymentMethod'
                value={pm.value}
                checked={form.method === pm.value}
                onChange={() => handleChange('method', pm.value)}
              />
              {pm.label}
            </label>
          ))}
        </div>
      </div>
      {form.method === 'card' && (
        <>
          <TextInput
            label='Card Number'
            value={form.cardNumber}
            onChange={(v) => handleChange('cardNumber', v || '')}
            required
          />
          <TextInput
            label='Cardholder Name'
            value={form.cardHolderName}
            onChange={(v) => handleChange('cardHolderName', v || '')}
            required
          />
          <div className='grid grid-cols-2 gap-4'>
            <TextInput
              label='Expiry Month'
              value={form.expiryMonth}
              onChange={(v) => handleChange('expiryMonth', v || '')}
              required
            />
            <TextInput
              label='Expiry Year'
              value={form.expiryYear}
              onChange={(v) => handleChange('expiryYear', v || '')}
              required
            />
          </div>
          <TextInput label='CVV' value={form.cvv} onChange={(v) => handleChange('cvv', v || '')} required />
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={form.saveCard}
              onChange={(e) => handleChange('saveCard', e.target.checked)}
              id='saveCard'
            />
            <label htmlFor='saveCard' className='ml-2'>
              Save card for future purchases
            </label>
          </div>
        </>
      )}
      {form.method !== 'card' && (
        <div className='rounded bg-gray-50 p-4'>
          <p className='text-gray-600'>
            You will be redirected to {paymentMethods.find((pm) => pm.value === form.method)?.label} to complete your
            payment.
          </p>
        </div>
      )}
      {error && <div className='text-red-500'>{error}</div>}
      <div className='flex justify-between'>
        <Button type='button' onClick={handleBack} label='Back'>
          Back
        </Button>
        <Button type='submit' label='Next'>
          Continue to Review
        </Button>
      </div>
    </form>
  )
}
