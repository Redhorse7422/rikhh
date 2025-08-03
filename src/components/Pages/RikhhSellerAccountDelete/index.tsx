'use client'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const RikhhSellerAccountDelete: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Rikhh Seller Account Delete</h1>
          <p className='text-lg text-gray-600'>
            Follow the steps below to delete your Rikhh seller account. Your account will be permanently deleted after
            30 days if you do not log in again during this period.
          </p>
        </div>

        {/* Main Content */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          {/* Title and Date */}
          <div className='mb-8 border-b border-gray-200 pb-6'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>Step by step process to delete your Rikhh seller account</h2>
          </div>

          {/* Policy Sections */}
          <div className='space-y-8'>
            {/* Section 1: Information We Collect */}
            <section>
              <div className='space-y-4'>
                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>a. Personal Information:</h4>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>Open the Rikhh seller app on your device</span>
                    </li>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span> Go to the Profile section </span>
                    </li>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span> Scroll down and tap on Delete Account </span>
                    </li>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span> Confirm your decision by following the on screen instructions </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Conclusion */}
          <div className='mt-12 border-t border-gray-200 pt-8'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <p className='font-medium text-gray-700'>
                Your account will be scheduled for deletion and will be permanently removed after 30 days If you log in
                to your account within these 30 days, the deletion process will be cancelled and your account will
                remain active
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className='mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white'>
          <h2 className='mb-4 text-2xl font-semibold'>Questions about our Privacy Policy?</h2>
          <p className='mb-6 text-blue-100'>Our team is here to help clarify any privacy concerns you may have</p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <a
              href='mailto:ambarikh20@gmail.com'
              className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100'
            >
              <Icon name='AiOutlineMail' className='mr-2 h-4 w-4' />
              Email Privacy Team
            </a>
            <a
              href='tel:7002330896'
              className='inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-blue-600'
            >
              <Icon name='AiOutlinePhone' className='mr-2 h-4 w-4' />
              Call Us: 7002330896
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
