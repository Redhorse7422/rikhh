'use client'

import React from 'react'

import { Icon } from '@/components/common/icon'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Privacy Policy</h1>
          <p className='text-lg text-gray-600'>How we collect, use, and protect your personal information</p>
        </div>

        {/* Main Content */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          {/* Title and Date */}
          <div className='mb-8 border-b border-gray-200 pb-6'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>Privacy Policy for Rikhh</h2>
            <p className='text-sm text-gray-600'>
              <strong>Effective Date:</strong> 12-12-2024
            </p>
          </div>

          {/* Introduction */}
          <div className='mb-8'>
            <p className='leading-relaxed text-gray-700'>
              Rikhh (`we,` `our,` or `us`) respects your privacy and is committed to protecting it through this Privacy
              Policy. This document outlines how we collect, use, and safeguard the personal information of our users,
              including sellers, workers, and customers. By using Rikhh, you agree to the practices described in this
              Privacy Policy.
            </p>
          </div>

          {/* Policy Sections */}
          <div className='space-y-8'>
            {/* Section 1: Information We Collect */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  1
                </span>
                Information We Collect
              </h3>
              <p className='mb-4 text-gray-700'>
                We collect various types of information to facilitate smooth operations and provide a secure platform.
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>a. Personal Information:</h4>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>
                        Name, phone number, email address, and location (GPS or manual entry) for account creation and
                        connectivity.
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>Aadhar card and PAN card details for identity verification and compliance.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>b. Business Information (Sellers and Workers):</h4>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>Store name, product details, service offerings, and pricing for platform listing.</span>
                    </li>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>Financial details, such as bank account information, for commission processing.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>c. Device Information:</h4>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>
                        Device identifiers, IP addresses, and browser type to ensure platform security and improve user
                        experience.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>d. Usage Data:</h4>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-start'>
                      <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span>
                        Transaction history, product uploads, and interaction details to enhance functionality.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Collected Information */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  2
                </span>
                How We Use Collected Information
              </h3>
              <p className='mb-4 text-gray-700'>The information we collect is used to:</p>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Provide and improve our services.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Verify user identity and ensure compliance with legal regulations.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Facilitate transactions and communication between buyers, sellers, and workers.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Maintain platform security and prevent fraudulent activities.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Provide customer support and resolve disputes.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Analyze usage trends to improve platform performance.</span>
                </li>
              </ul>
            </section>

            {/* Section 3: Sharing of Information */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  3
                </span>
                Sharing of Information
              </h3>
              <p className='mb-4 text-gray-700'>
                We do not sell or rent your information to third parties. Information is shared only under the following
                circumstances:
              </p>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>With your consent:</strong> When you explicitly allow us to share your information.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>For legal purposes:</strong> To comply with applicable laws, regulations, or government
                    requests.
                  </span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>
                    <strong>With service providers:</strong> To assist with payment processing, data analytics, or
                    customer support.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 4: Data Retention */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  4
                </span>
                Data Retention
              </h3>
              <p className='text-gray-700'>
                We retain your data as long as your account is active or as required by law. You may request account
                deletion or data removal, subject to our compliance obligations.
              </p>
            </section>

            {/* Section 5: Data Security */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  5
                </span>
                Data Security
              </h3>
              <p className='text-gray-700'>
                We implement industry-standard security measures to protect your information. However, no system is
                entirely secure, and we cannot guarantee complete security.
              </p>
            </section>

            {/* Section 6: Your Rights */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  6
                </span>
                Your Rights
              </h3>
              <p className='mb-4 text-gray-700'>As a user of Rikhh, you have the right to:</p>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Access and update your personal information.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>Request deletion or restriction of your data.</span>
                </li>
                <li className='flex items-start'>
                  <Icon name='AiOutlineCheck' className='mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span>File a complaint if you believe your data is mishandled.</span>
                </li>
              </ul>
              <p className='mt-4 text-gray-700'>
                To exercise your rights, contact us at{' '}
                <a href='mailto:ambarikh20@gmail.com' className='text-blue-600 hover:underline'>
                  ambarikh20@gmail.com
                </a>
                .
              </p>
            </section>

            {/* Section 7: Changes to This Policy */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  7
                </span>
                Changes to This Policy
              </h3>
              <p className='text-gray-700'>
                We reserve the right to modify this Privacy Policy. Users will be notified of any significant changes
                via email or platform notifications.
              </p>
            </section>

            {/* Section 8: Contact Us */}
            <section>
              <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                  8
                </span>
                Contact Us
              </h3>
              <p className='mb-4 text-gray-700'>
                If you have any questions or concerns about this Privacy Policy, please contact:
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
                    <strong>Phone:</strong> 7002330896
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Conclusion */}
          <div className='mt-12 border-t border-gray-200 pt-8'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <p className='font-medium text-gray-700'>
                This Privacy Policy ensures compliance with Indian data protection laws and safeguards user interests.
                By using Rikhh, you accept this policy.
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
