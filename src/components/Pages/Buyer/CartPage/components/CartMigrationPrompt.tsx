import React, { useState } from 'react'

import { useSession } from 'next-auth/react'

import { GuestMigrationModal } from '@/components/Auth/GuestMigrationModal'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'

interface CartMigrationPromptProps {
  onDismiss: () => void
}

export const CartMigrationPrompt: React.FC<CartMigrationPromptProps> = ({ onDismiss }) => {
  const { data: session } = useSession()
  const [showMigrationModal, setShowMigrationModal] = useState(false)

  // Don't show for authenticated users
  if (session?.user) {
    return null
  }

  const handleCreateAccount = () => {
    setShowMigrationModal(true)
  }

  const handleMigrationSuccess = () => {
    // Refresh the page to update the session and show authenticated cart
    window.location.reload()
  }

  return (
    <>
      <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <Icon name='AiOutlineUser' className='h-5 w-5 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h3 className='font-semibold text-blue-900'>Create an Account</h3>
            <p className='mt-1 text-sm text-blue-800'>Save your cart items and get faster checkout next time!</p>
            <div className='mt-3 flex space-x-2'>
              <Button label='Create Account' onClick={handleCreateAccount} size='small' />
              <Button label='Maybe Later' variant='outlinePrimary' onClick={onDismiss} size='small' />
            </div>
          </div>
        </div>
      </div>

      <GuestMigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onSuccess={handleMigrationSuccess}
      />
    </>
  )
}
