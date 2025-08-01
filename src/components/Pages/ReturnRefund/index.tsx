'use client'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const ReturnRefundPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Return and Refund Policy</h1>
          <p className='text-lg text-gray-600'>
            Understanding our unique in-store shopping approach and return policies
          </p>
        </div>

        {/* Main Content */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          {/* Title and Date */}
          <div className='mb-8 border-b border-gray-200 pb-6'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>Return and Refund Policy for Rikhh</h2>
            <p className='text-sm text-gray-600'>
              <strong>Effective Date:</strong> 12-12-2024
            </p>
          </div>

          {/* Important Notice */}
          <div className='mb-8 rounded-lg border border-red-200 bg-red-50 p-6'>
            <div className='flex items-start'>
              <Icon name='AiOutlineExclamationCircle' className='mr-3 mt-0.5 h-6 w-6 flex-shrink-0 text-red-500' />
              <div>
                <h3 className='mb-2 text-lg font-semibold text-red-800'>Shopping In Store Only</h3>
                <p className='text-red-700'>
                  We do not provide a return and refund policy. It solely depends on the sellers discretion. Please
                  check the seller policy before making any purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className='mb-8'>
            <h3 className='mb-4 text-xl font-semibold text-gray-900'>Welcome to Rikhh!</h3>
            <p className='leading-relaxed text-gray-700'>
              At Rikhh, we believe in providing a unique and personalized shopping experience for our valued customers.
              Unlike traditional e-commerce platforms, we offer a distinctive approach to purchasing products –
              exclusively in store. Here is what you need to know about shopping with us:
            </p>
          </div>

          {/* Policy Sections */}
          <div className='space-y-8'>
            {/* Section 1: Why In-Store Only */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  1
                </span>
                Why In-Store Only?
              </h3>
              <p className='leading-relaxed text-gray-700'>
                We understand the importance of touch, feel, and personal interaction when it comes to making purchasing
                decisions. While online shopping offers convenience, it sometimes lacks the tangible experience that
                many customers seek. By exclusively offering in-store shopping, we aim to bridge this gap, ensuring that
                our customers can explore our products firsthand and make well informed choices.
              </p>
            </section>

            {/* Section 2: How It Works */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  2
                </span>
                How It Works
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <span className='mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600'>
                    1
                  </span>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900'>Browse Online, Shop In Store</h4>
                    <p className='text-gray-700'>
                      You can explore our extensive range of products on our website from the comfort of your home.
                      Whether you are looking for electronics, fashion, home decor, or more, you will find a diverse
                      selection to choose from.
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <span className='mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600'>
                    2
                  </span>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900'>Visit Rikhh Stores</h4>
                    <p className='text-gray-700'>
                      Once you have found products you are interested in, simply visit rikhh stores near your location
                      to see them up close. Our store is conveniently located at all India, making it easily accessible
                      for all our customers.
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <span className='mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600'>
                    3
                  </span>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900'>Personalized Assistance</h4>
                    <p className='text-gray-700'>
                      Our friendly and knowledgeable staff will be on hand to assist you during your visit. Whether you
                      need help finding the right size, understanding product features, or comparing options, we are
                      here to ensure you have a seamless shopping experience.
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <span className='mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600'>
                    4
                  </span>
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900'>Purchase and Enjoy</h4>
                    <p className='text-gray-700'>
                      After exploring our store and selecting your desired items, you can make your purchase at the
                      checkout counter. Once you have completed your transaction, you can take your new purchases home
                      with you immediately, no waiting for shipping!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Benefits of Shopping In Store */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  3
                </span>
                Benefits of Shopping In Store
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>Hands-On Experience:</strong> Get a feel for the quality, texture, and functionality of
                    products before making a purchase.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>Instant Gratification:</strong> Take your purchases home with you the same day, without any
                    delays or waiting for shipping.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>Support Local Businesses:</strong> By shopping in-store, you are supporting local businesses
                    and contributing to the growth of your community.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 4: Return and Refund Policy */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  4
                </span>
                Return and Refund Policy
              </h3>
              <div className='space-y-4'>
                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
                  <div className='flex items-start'>
                    <Icon name='AiOutlineInfoCircle' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600' />
                    <div>
                      <h4 className='mb-1 font-semibold text-yellow-800'>Important Notice</h4>
                      <p className='text-yellow-700'>
                        Rikhh operates as an in-store shopping platform only. We do not provide a standardized return
                        and refund policy. All return and refund decisions are made at the sole discretion of individual
                        sellers.
                      </p>
                    </div>
                  </div>
                </div>
                <ul className='space-y-2 text-gray-700'>
                  <li className='flex items-start'>
                    <Icon
                      name='AiOutlineFileExclamation'
                      className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500'
                    />
                    <span>Return and refund policies vary by seller and are subject to individual seller terms.</span>
                  </li>
                  <li className='flex items-start'>
                    <Icon
                      name='AiOutlineFileExclamation'
                      className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500'
                    />
                    <span>
                      Customers must review and understand the sellers specific return policy before making a purchase.
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <Icon
                      name='AiOutlineFileExclamation'
                      className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500'
                    />
                    <span>
                      Rikhh acts as a facilitator and is not responsible for return or refund decisions made by sellers.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Visit Us Today */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  5
                </span>
                Visit Us Today!
              </h3>
              <div className='space-y-4'>
                <p className='leading-relaxed text-gray-700'>
                  Ready to embark on a unique shopping journey? Visit Rikhh in store today and discover a world of
                  quality products, personalized service, and unparalleled convenience. We look forward to welcoming you
                  and assisting you with all your shopping needs.
                </p>
                <div className='rounded-lg bg-blue-50 p-4 text-center'>
                  <p className='text-lg font-semibold text-blue-800'>Rikhh – Where Shopping is an Experience.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Conclusion */}
          <div className='mt-12 border-t border-gray-200 pt-8'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <p className='font-medium text-gray-700'>
                By shopping at Rikhh stores, you acknowledge and agree to our in-store shopping approach and
                seller-specific return policies.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className='mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white'>
          <h2 className='mb-4 text-2xl font-semibold'>Need help?</h2>
          <p className='mb-6 text-blue-100'>Contact us for questions related to refunds and returns</p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <a
              href='mailto:contact@rikhh.com'
              className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100'
            >
              <Icon name='AiOutlineMail' className='mr-2 h-4 w-4' />
              Email Support
            </a>
            <a
              href='tel:7002330866'
              className='inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-blue-600'
            >
              <Icon name='AiOutlinePhone' className='mr-2 h-4 w-4' />
              Call Us: 7002330866
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
