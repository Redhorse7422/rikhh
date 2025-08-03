import React, { useState } from 'react'

import Link from 'next/link'

import { ChevronUpIcon, XIcon } from '@/assets/icons'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact-us' },
  // { name: 'Best Sellers', href: '/best-sellers' },
  // { name: 'Clearance', href: '/clearance' },
]

export const BuyerNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-12 w-full items-center justify-between gap-4 lg:h-14 lg:justify-center'>
          {/* Main Menu Items - Desktop */}
          <div className='hidden items-center space-x-8 md:flex'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-primary'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='flex items-center justify-center p-2 text-gray-700 hover:text-primary'
              aria-label='Toggle mobile menu'
            >
              {isMobileMenuOpen ? (
                <XIcon className='h-6 w-6' />
              ) : (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>

          {/* Right Side - Promotional */}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <div className='border-t border-gray-200 bg-white px-2 py-2 shadow-lg'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
