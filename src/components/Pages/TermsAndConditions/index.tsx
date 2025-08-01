'use client'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Terms and Conditions</h1>
          <p className='text-lg text-gray-600'>Please read these terms carefully before using our platform</p>
        </div>

        {/* Main Content */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          {/* Title and Date */}
          <div className='mb-8 border-b border-gray-200 pb-6'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>Terms and Conditions for Rikhh</h2>
            <p className='text-sm text-gray-600'>
              <strong>Effective Date:</strong> 12-12-2024
            </p>
          </div>

          {/* Introduction */}
          <div className='mb-8'>
            <p className='leading-relaxed text-gray-700'>
              Welcome to Rikhh! By using our platform, you agree to comply with these terms and conditions (`Terms`).
              These Terms constitute a legally binding agreement between you (`User,` `Seller,` or `Worker`) and Rikhh
              (`we,` `our,` or `us`). If you do not agree with these Terms, please do not use the platform.
            </p>
          </div>

          {/* Terms Sections */}
          <div className='space-y-8'>
            {/* Section 1: Eligibility */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  1
                </span>
                Eligibility
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>To register as a Seller or Worker, you must be at least 18 years old.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Users must provide accurate and complete information during registration.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Identity verification through Aadhar and PAN card details is mandatory for Sellers and Workers.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 2: Use of the Platform */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  2
                </span>
                Use of the Platform
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Rikhh provides a platform for Sellers to list products and Workers to offer services.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Buyers interact directly with Sellers or Workers; we are not responsible for disputes, pricing, or
                    service quality.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Sellers and Workers are solely responsible for their listings, including product/service accuracy,
                    quality, and compliance with applicable laws.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3: Fees and Payments */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  3
                </span>
                Fees and Payments
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Sellers must pay a <strong>2% commission</strong> on every product or service sold through the
                    platform.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Payments can be made via the methods specified in the platform.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Rikhh reserves the right to change commission rates with prior notice.</span>
                </li>
              </ul>
            </section>

            {/* Section 4: User Responsibilities */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  4
                </span>
                User Responsibilities
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Users must not upload or sell prohibited items, counterfeit goods, or illegal products.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Workers must not offer illegal services or operate without required licenses if applicable.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>All Users must comply with local, state, and national laws while using the platform.</span>
                </li>
              </ul>
            </section>

            {/* Section 5: Content Guidelines */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  5
                </span>
                Content Guidelines
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Users must upload high-quality, clear images and accurate descriptions of their products or
                    services.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Rikhh reserves the right to remove content deemed inappropriate, misleading, or in violation of
                    these Terms.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 6: Liability and Disclaimers */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  6
                </span>
                Liability and Disclaimers
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Rikhh acts solely as a facilitator and is not liable for disputes between Buyers, Sellers, and
                    Workers.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    We do not guarantee the quality, legality, or safety of products or services listed on the platform.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Users are responsible for ensuring compliance with local tax obligations and other legal
                    requirements.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 7: Termination */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  7
                </span>
                Termination
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    Rikhh reserves the right to terminate or suspend accounts for violations of these Terms or
                    applicable laws.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Users may deactivate their accounts at any time by contacting support.</span>
                </li>
              </ul>
            </section>

            {/* Section 8: Indemnification */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  8
                </span>
                Indemnification
              </h3>
              <p className='text-gray-700'>
                Users agree to indemnify and hold Rikhh harmless from any claims, damages, or expenses arising from
                their use of the platform.
              </p>
            </section>

            {/* Section 9: Amendments */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  9
                </span>
                Amendments
              </h3>
              <p className='text-gray-700'>
                Rikhh may update these Terms at any time. Users will be notified of significant changes through email or
                app notifications. Continued use of the platform constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 10: Governing Law */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  10
                </span>
                Governing Law
              </h3>
              <p className='text-gray-700'>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
                jurisdiction of the courts in Assam, India.
              </p>
            </section>

            {/* Section 11: Contact Information */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  11
                </span>
                Contact Information
              </h3>
              <p className='mb-4 text-gray-700'>
                If you have any questions or concerns about these Terms, contact us at:
              </p>
              <div className='space-y-2 rounded-lg bg-gray-50 p-4'>
                <div className='flex items-center'>
                  <Icon name='AiOutlineUser' className='mr-2 h-4 w-4 text-gray-500' />
                  <span className='text-gray-700'>
                    <strong>Company Name:</strong> WORKERS CIVILIZATION
                  </span>
                </div>
                <div className='flex items-center'>
                  <Icon name='AiOutlineEnvironment' className='mr-2 h-4 w-4 text-gray-500' />
                  <span className='text-gray-700'>
                    <strong>Address:</strong> 15 No. Jalani, Baruah Tiniali, Duliajan, Assam
                  </span>
                </div>
                <div className='flex items-center'>
                  <Icon name='AiOutlineMail' className='mr-2 h-4 w-4 text-gray-500' />
                  <span className='text-gray-700'>
                    <strong>Email:</strong> ambarikh20@gmail.com
                  </span>
                </div>
                <div className='flex items-center'>
                  <Icon name='AiOutlinePhone' className='mr-2 h-4 w-4 text-gray-500' />
                  <span className='text-gray-700'>
                    <strong>Phone:</strong> 7002330866
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Conclusion */}
          <div className='mt-12 border-t border-gray-200 pt-8'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <p className='font-medium text-gray-700'>
                By using Rikhh, you acknowledge and agree to these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className='mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white'>
          <h2 className='mb-4 text-2xl font-semibold'>Questions about our Terms?</h2>
          <p className='mb-6 text-blue-100'>Our legal team is here to help clarify any questions you may have</p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <a
              href='mailto:ambarikh20@gmail.com'
              className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100'
            >
              <Icon name='AiOutlineMail' className='mr-2 h-4 w-4' />
              Email Legal Team
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
