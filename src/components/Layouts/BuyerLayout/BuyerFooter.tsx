'use client'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const BuyerFooter: React.FC = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Left Section - Branding, Contact, and Social Media */}
          <div className='lg:col-span-2'>
            {/* Brand Name */}
            <div className='mb-6'>
              <h2 className='text-3xl font-bold text-white' style={{ fontFamily: 'cursive' }}>
                Rikhh
              </h2>
            </div>

            {/* Contact Prompt */}
            <div className='mb-4'>
              <p className='text-sm text-gray-300'>Got Question? Call us 24/7</p>
            </div>

            {/* Phone Number */}
            <div className='mb-4'>
              <p className='text-2xl font-bold text-white'>+91-70023-30896</p>
            </div>

            {/* Call to Action */}
            <div className='mb-8'>
              <p className='text-sm leading-relaxed text-gray-300'>
                Register now to unlock exclusive discounts on products from both local and global vendors!
              </p>
            </div>

            {/* Social Media Icons */}
            <div className='flex space-x-3'>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700'
                aria-label='Facebook'
              >
                <Icon name='FaFacebookF' className='h-4 w-4' color='white' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-600'
                aria-label='Twitter'
              >
                <Icon name='FaTwitter' className='h-4 w-4' color='white' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600'
                aria-label='Instagram'
              >
                <Icon name='FaInstagram' className='h-4 w-4' color='white' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700'
                aria-label='YouTube'
              >
                <Icon name='FaYoutube' className='h-4 w-4' color='white' />
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600'
                aria-label='Pinterest'
              >
                <span className='text-sm font-bold'>P</span>
              </a>
            </div>
          </div>

          {/* COMPANY Links */}
          <div>
            <h3 className='mb-4 text-sm font-bold uppercase text-white'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='/about-us'
                  className='rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-blue-900 hover:text-white'
                >
                  About Us
                </a>
              </li>
              <li>
                <a href='/become-seller' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Become a Seller
                </a>
              </li>
              <li>
                <a href='/faqs' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  FAQs
                </a>
              </li>
              <li>
                <a href='/contact-us' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='/return-refund-policy' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Return and Refund policy
                </a>
              </li>
              <li>
                <a href='/terms-conditions' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* MY ACCOUNT Links */}
          <div>
            <h3 className='mb-4 text-sm font-bold uppercase text-white'>My Account</h3>
            <ul className='space-y-2'>
              <li>
                <a href='/rikhh-account-delete' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Rikhh Account Delete
                </a>
              </li>
              <li>
                <a href='/rikhh-seller-account-delete' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Rikhh Seller Account Delete
                </a>
              </li>
              <li>
                <a href='/signin' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Sign In
                </a>
              </li>
              <li>
                <a href='/order-history' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Order History
                </a>
              </li>
              <li>
                <a href='/wishlist' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  My Wishlist
                </a>
              </li>
              <li>
                <a href='/privacy-policy' className='text-sm text-gray-300 transition-colors hover:text-white'>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className='mb-4 text-sm font-bold uppercase text-white'>Help & Support</h3>
            <ul className='space-y-3'>
              <li className='flex items-center space-x-2'>
                <Icon name='AiOutlinePhone' className='h-4 w-4 text-gray-300' />
                <span className='text-sm text-gray-300'>+91-70023-30896</span>
              </li>
              <li className='flex items-center space-x-2'>
                <Icon name='AiOutlineMail' className='h-4 w-4 text-gray-300' />
                <span className='text-sm text-gray-300'>contact@rikhh.com</span>
              </li>
              <li className='flex items-center space-x-2'>
                <Icon name='AiOutlineEnvironment' className='h-4 w-4 text-gray-300' />
                <span className='text-sm text-gray-300'>Assam, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 border-t border-gray-800 pt-8'>
          <p className='text-center text-sm text-gray-400'>
            Copyright © 2025 Rikhh TM, WORKERS CIVILIZATION. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
