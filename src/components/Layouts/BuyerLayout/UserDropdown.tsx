'use client'

import { useState } from 'react'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { Icon } from '@/components/common/icon'
import { Dropdown, DropdownContent, DropdownTrigger } from '@/components/ui/dropdown'

export const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  if (!session?.user) return null

  const userName =
    `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || session.user.email || 'User'
  const userEmail = session.user.email || ''

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className='rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1'>
        <span className='sr-only'>My Account</span>

        <div className='flex items-center gap-2 p-2 text-gray-600 transition-colors hover:text-primary'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white'>
            <span className='text-sm font-medium'>{userName.charAt(0).toUpperCase()}</span>
          </div>
          <span className='hidden text-sm font-medium md:block'>{userName}</span>
          <Icon name='AiOutlineDown' className='h-4 w-4' />
        </div>
      </DropdownTrigger>

      <DropdownContent className='min-w-[200px] border border-stroke bg-white shadow-md' align='end'>
        <div className='border-b border-gray-200 p-4'>
          <div className='font-medium text-gray-900'>{userName}</div>
          <div className='text-sm text-gray-600'>{userEmail}</div>
        </div>

        <div className='p-2'>
          <Link
            href='/profile'
            onClick={() => setIsOpen(false)}
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            <Icon name='AiOutlineUser' className='h-4 w-4' />
            <span>Profile</span>
          </Link>

          <Link
            href='/orders'
            onClick={() => setIsOpen(false)}
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            <Icon name='AiOutlineShopping' className='h-4 w-4' />
            <span>My Orders</span>
          </Link>

          <Link
            href='/settings'
            onClick={() => setIsOpen(false)}
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            <Icon name='AiOutlineSetting' className='h-4 w-4' />
            <span>Settings</span>
          </Link>
        </div>

        <div className='border-t border-gray-200 p-2'>
          <button
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: '/' })
            }}
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50'
          >
            <Icon name='AiOutlineLogout' className='h-4 w-4' />
            <span>Sign Out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
