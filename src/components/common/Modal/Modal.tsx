'use client'

import type { ReactNode } from 'react'

import { Icon } from '@/components/common/icon'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hideCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export const Modal = ({ open, onClose, title, children, size = 'md', hideCloseButton = false }: ModalProps) => {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className={`w-full ${sizeClasses[size]} max-h-[90vh] rounded-lg bg-white shadow-xl dark:bg-gray-dark flex flex-col`}>
        <div className='flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>{title}</h2>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              >
                <Icon name='AiOutlineClose' className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
        <div className='flex-1 overflow-y-auto p-6 pt-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
