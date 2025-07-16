'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import LOGO from '@/assets/logos/logo.webp'
import { Modal } from '@/components/common/Modal/Modal'

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const AgeConfirmationGate = ({ children }: { children: React.ReactNode }) => {
  const [ageConfirmed, setAgeConfirmed] = useState<boolean | null>(null)
  const [showBlocked, setShowBlocked] = useState(false)

  useEffect(() => {
    // Check cookie on mount
    if (getCookie('ageConfirmed') === 'yes') {
      setAgeConfirmed(true)
      setShowBlocked(false)
    } else {
      setAgeConfirmed(null)
      setShowBlocked(false)
    }
  }, [])

  const handleConfirm = () => {
    setCookie('ageConfirmed', 'yes', 1) // 1 day
    setAgeConfirmed(true)
    setShowBlocked(false)
    if (typeof window !== 'undefined') {
      console.log('User confirmed over 21')
    }
  }

  const handleReject = () => {
    setAgeConfirmed(false)
    setShowBlocked(true)
  }

  const showOverlay = ageConfirmed === null || showBlocked

  return (
    <div className='relative'>
      {/* Always render children, but blur and block interaction if modal is open */}
      <div className={showOverlay ? 'pointer-events-none select-none blur-sm brightness-75 filter' : ''}>
        {children}
      </div>
      {showOverlay && (
        <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <Modal
            open={true}
            onClose={() => {}}
            title={showBlocked ? 'Access Denied' : 'Age Confirmation'}
            hideCloseButton
          >
            <div className='space-y-6 text-center'>
              <div className='flex w-full justify-center'>
                <Image src={LOGO} alt='Aura Well USA' width={180} height={84} className='h-20 w-auto' />
              </div>
              {showBlocked ? (
                <p className='text-lg font-semibold text-red-600'>
                  You must be 21 years or older to enter this website.
                </p>
              ) : (
                <>
                  <p className='text-lg font-semibold text-black'>Are you over 21 years of age?</p>
                  <div className='mt-6 flex justify-center gap-4'>
                    <button
                      className='rounded bg-primary px-6 py-2 font-bold text-white hover:bg-primary/90'
                      onClick={handleConfirm}
                    >
                      Yes
                    </button>
                    <button
                      className='rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300'
                      onClick={handleReject}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}
