import React from 'react'

import { useCheckout } from '../context/CheckoutContext'

import { BillingStep } from './BillingStep'
import { ConfirmationStep } from './ConfirmationStep'
import { GuestShippingStep } from './GuestShippingStep'
import { PaymentStep } from './PaymentStep'
import { ReviewStep } from './ReviewStep'
import { ShippingMethodStep } from './ShippingMethodStep'
import { ShippingStep } from './ShippingStep'

export const CheckoutSteps: React.FC = () => {
  const {
    currentStep,
    isGuestMode,
    shippingOptions,
    selectedShippingOption,
    onStepChange,
    onSelectShippingOption,
    isCalculatingShipping,
  } = useCheckout()

  let StepComponent: React.ReactNode
  switch (currentStep) {
    case 'shipping':
      StepComponent = isGuestMode ? (
        <GuestShippingStep onNext={() => onStepChange('billing')} onBack={() => {}} />
      ) : (
        <ShippingStep />
      )
      break
    case 'billing':
      StepComponent = <BillingStep />
      break
    case 'shipping-method':
      StepComponent = <ShippingMethodStep />
      break
    case 'payment':
      StepComponent = <PaymentStep />
      break
    case 'review':
      StepComponent = <ReviewStep />
      break
    case 'confirmation':
      StepComponent = <ConfirmationStep />
      break
    default:
      StepComponent = null
  }

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold capitalize'>{currentStep} Details</h2>
      </div>
      <div>{StepComponent}</div>
    </div>
  )
}
