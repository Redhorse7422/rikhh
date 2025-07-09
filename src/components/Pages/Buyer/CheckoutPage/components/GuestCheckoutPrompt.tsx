import React, { useState } from 'react'

import { useSession } from 'next-auth/react'

import { LoginPopup } from '@/components/Auth/LoginPopup'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'

interface GuestCheckoutPromptProps {
  onContinueAsGuest: () => void
}

export const GuestCheckoutPrompt: React.FC<GuestCheckoutPromptProps> = ({ onContinueAsGuest }) => {
  const { data: session } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Don't show for authenticated users
  if (session?.user) {
    return null
  }

  const handleCreateAccount = () => {
    setShowAuthModal(true)
  }

  return (
    <>
      <div className='mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6'>
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0'>
            <Icon name='AiOutlineUser' className='h-6 w-6 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-blue-900'>Guest Checkout</h3>
            <p className='mt-1 text-sm text-blue-800'>You are checking out as a guest. Create an account to:</p>
            <ul className='mt-2 space-y-1 text-sm text-blue-700'>
              <li className='flex items-center'>
                <Icon name='AiOutlineCheck' className='mr-2 h-3 w-3' />
                Save your order history and track shipments
              </li>
              <li className='flex items-center'>
                <Icon name='AiOutlineCheck' className='mr-2 h-3 w-3' />
                Get faster checkout next time
              </li>
              <li className='flex items-center'>
                <Icon name='AiOutlineCheck' className='mr-2 h-3 w-3' />
                Access exclusive deals and promotions
              </li>
              <li className='flex items-center'>
                <Icon name='AiOutlineCheck' className='mr-2 h-3 w-3' />
                Migrate your current cart items and orders
              </li>
            </ul>

            <div className='mt-4 flex space-x-3'>
              <Button label='Create Account' onClick={handleCreateAccount} className='flex-1' />
              <Button
                label='Continue as Guest'
                variant='outlinePrimary'
                onClick={onContinueAsGuest}
                className='flex-1'
              />
            </div>
          </div>
        </div>
      </div>

      <LoginPopup isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
