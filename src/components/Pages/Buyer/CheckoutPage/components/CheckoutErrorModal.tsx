'use client'

import React from 'react'

import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal/Modal'
import { Icon } from '@/components/common/icon'

interface CheckoutError {
  code: string
  message: string
}

interface CheckoutErrorResponse {
  success: boolean
  error: CheckoutError
  statusCode: number
}

interface CheckoutErrorModalProps {
  isOpen: boolean
  onClose: () => void
  error: CheckoutErrorResponse | null
}

export const CheckoutErrorModal: React.FC<CheckoutErrorModalProps> = ({ isOpen, onClose, error }) => {
  if (!error) return null

  const getErrorTitle = (errorCode: string) => {
    switch (errorCode) {
      case 'CHECKOUT_INITIATION_FAILED':
        return 'Checkout Failed'
      case 'SHIPPING_RESTRICTION':
        return 'Shipping Restriction'
      case 'PRODUCT_UNAVAILABLE':
        return 'Product Unavailable'
      case 'PAYMENT_FAILED':
        return 'Payment Failed'
      default:
        return 'Checkout Error'
    }
  }

  const getErrorIcon = (errorCode: string) => {
    switch (errorCode) {
      case 'CHECKOUT_INITIATION_FAILED':
      case 'SHIPPING_RESTRICTION':
        return 'AiOutlineCloseCircle'
      case 'PRODUCT_UNAVAILABLE':
        return 'AiOutlineShopping'
      case 'PAYMENT_FAILED':
        return 'AiOutlineCloseCircle'
      default:
        return 'AiOutlineCloseCircle'
    }
  }

  const parseErrorMessage = (message: string) => {
    // Check if the message contains product-specific information
    if (message.includes('Products cannot be shipped to')) {
      const parts = message.split('Products cannot be shipped to')
      if (parts.length > 1) {
        const statePart = parts[1].split(':')[0].trim()
        const productsPart = parts[1].split(':')[1]?.trim()

        return {
          mainMessage: `Some products in your cart cannot be shipped to ${statePart}.`,
          details: productsPart ? `Restricted products: ${productsPart}` : null,
          state: statePart,
        }
      }
    }

    return {
      mainMessage: message,
      details: null,
      state: null,
    }
  }

  const errorInfo = parseErrorMessage(error.error.message)

  return (
    <Modal open={isOpen} onClose={onClose} title={getErrorTitle(error.error.code)} size='md'>
      <div className='space-y-4'>
        {/* Error Icon and Main Message */}
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
              <Icon name={getErrorIcon(error.error.code)} className='h-6 w-6 text-red-600 dark:text-red-400' />
            </div>
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-900 dark:text-white'>{errorInfo.mainMessage}</p>
            {errorInfo.details && <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{errorInfo.details}</p>}
          </div>
        </div>

        {/* Additional Information */}
        {error.error.code === 'CHECKOUT_INITIATION_FAILED' && errorInfo.state && (
          <div className='rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <Icon name='AiOutlineCheckCircle' className='h-5 w-5 text-yellow-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>What can you do?</h3>
                <div className='mt-2 text-sm text-yellow-700 dark:text-yellow-300'>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>Remove the restricted products from your cart</li>
                    <li>Change your shipping address to an allowed state</li>
                    {/* <li>Contact customer support for assistance</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Details for Debugging */}
        {process.env.NODE_ENV === 'development' && (
          <details className='mt-4'>
            <summary className='cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
              Technical Details
            </summary>
            <div className='mt-2 rounded-md bg-gray-100 p-3 dark:bg-gray-800'>
              <pre className='text-xs text-gray-600 dark:text-gray-400'>{JSON.stringify(error, null, 2)}</pre>
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <Button type='button' label='Close' variant='outlinePrimary' onClick={onClose} />
          {error.error.code === 'CHECKOUT_INITIATION_FAILED' && (
            <Button
              type='button'
              label='Review Cart'
              onClick={() => {
                onClose()
                // Navigate to cart page
                window.location.href = '/buyer/cart'
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
