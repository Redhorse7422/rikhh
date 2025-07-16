import type { CheckoutStep } from '../index'

import React from 'react'

const steps: CheckoutStep[] = ['shipping', 'billing', 'shipping-method', 'payment', 'review', 'confirmation']

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const currentIndex = steps.indexOf(currentStep)
  return (
    <nav aria-label='Progress' className='mb-8 overflow-x-auto'>
      <ol className='flex w-full min-w-max items-center justify-between whitespace-nowrap'>
        {steps.map((step, idx) => (
          <li key={step} className='flex items-center'>
            <div
              className={`flex flex-col items-center ${idx < currentIndex ? 'text-primary' : idx === currentIndex ? 'text-primary' : 'text-gray-400'}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-current bg-white font-bold ${idx < currentIndex ? 'bg-primary/10' : ''}`}
              >
                {idx < currentIndex ? (
                  <svg
                    className='h-5 w-5 text-primary'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              <span className='mt-1 text-xs capitalize'>{step.replace('-', ' ')}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className='relative mx-2 h-1 w-8 rounded-full bg-gray-200 sm:w-16'>
                <div
                  className={`h-1 rounded-full ${idx < currentIndex ? 'bg-primary' : 'bg-gray-200'} absolute left-0 top-0 w-full`}
                ></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
