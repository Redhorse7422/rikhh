import type { CheckoutStep } from '../index'

import React from 'react'

const steps: CheckoutStep[] = ['shipping', 'billing', 'shipping-method', 'payment', 'review', 'confirmation']

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const currentIndex = steps.indexOf(currentStep)
  return (
    <nav aria-label='Progress' className='mb-8'>
      <ol className='flex items-center'>
        {steps.map((step, idx) => (
          <li key={step} className='flex flex-1 items-center'>
            <div className={`flex items-center ${idx <= currentIndex ? 'text-primary' : 'text-gray-400'}`}>
              <span className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-current font-bold'>
                {idx + 1}
              </span>
              <span className='ml-2 capitalize'>{step}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className='mx-2 h-1 flex-1 rounded-full bg-gray-200'>
                <div className={`h-1 rounded-full ${idx < currentIndex ? 'bg-primary' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
