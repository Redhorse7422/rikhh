'use client'

import React, { useState } from 'react'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'

const faqData = [
  {
    question: 'How can I cancel my order?',
    answer:
      'When cancelling your order, please provide a brief description of the reason for cancellation. This helps us improve our service and ensures we meet your needs effectively. Whether it\'s a change of plans, an issue with the product, or any other reason, your feedback is valuable to us. Simply let us know why you\'re cancelling your order, and we\'ll process it promptly. Thank you for your understanding and cooperation.',
  },
  {
    question: 'Why is my Vendor registration delayed?',
    answer:
      'We apologize for the delay in processing your vendor registration. Due to high demand and an influx of registrations, the process may take up to 7 days to complete. Rest assured, our team is working diligently to review and approve your application as quickly as possible. If you have any urgent inquiries or concerns during this time, please don\'t hesitate to contact us at support@rikh.com. We appreciate your patience and understanding.',
  },
  {
    question: 'What do I need to buy products?',
    answer:
      'For in shop purchases, simply visit our store to buy the products you need. No additional information is required except for your name, address (including pin code), current location, and phone number, which may be requested for verification purposes during the transaction process. Experience the convenience of shopping in person and explore our range of products firsthand at our store. We look forward to welcoming you soon!',
  },
  {
    question: 'How can I track an order?',
    answer:
      'To track your order for products booked in-store, simply visit our shop and utilize our self service kiosk. With just your booking information, you can easily locate your items and complete the purchase transaction independently. Experience the convenience of tracking and picking up your products at your own pace, without the need for staff assistance. We strive to make your shopping experience effortless and efficient.',
  },
  {
    question: 'How can I get money back?',
    answer:
      'To request a refund, please visit the store or shop where you made your purchase, inspect the product, and proceed with buying it if it meets your satisfaction. If the shop has any refund or return policies in place, kindly review and adhere to their guidelines. It\'s important to note that Rikhh is not responsible for managing refunds or returns. We encourage you to familiarize yourself with the shop\'s policies to ensure a smooth transaction experience. Thank you for your understanding.',
  },
]

export const ContactUsPage: React.FC = () => {

  const [activeFaq, setActiveFaq] = useState<number | null>(null)



  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Contact Information</h1>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            Easily reach out to us at Rikhh. Contact information for inquiries, collaborations, or any assistance you
            require
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Contact Information */}
          <div className='lg:col-span-1'>
            <div className='h-fit rounded-lg bg-white p-6 shadow-sm'>
              <h2 className='mb-6 text-2xl font-semibold text-gray-900'>Get in Touch</h2>

              <div className='space-y-6'>
                {/* Email */}
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                      <Icon name='AiOutlineMail' className='h-5 w-5 text-blue-600' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>E-mail Address</h3>
                    <p className='mt-1 text-sm text-gray-600'>contact@rikhh.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                      <Icon name='AiOutlinePhone' className='h-5 w-5 text-green-600' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Phone Number</h3>
                    <p className='mt-1 text-sm text-gray-600'>+91-7002330896</p>
                    <p className='mt-1 text-xs text-gray-500'>24/7 Support Available</p>
                  </div>
                </div>

                {/* Address */}
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                      <Icon name='AiOutlineEnvironment' className='h-5 w-5 text-purple-600' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Address</h3>
                    <p className='mt-1 text-sm text-gray-600'>Assam, India</p>
                  </div>
                </div>

                {/* Fax */}
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100'>
                      <Icon name='AiOutlinePrinter' className='h-5 w-5 text-orange-600' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Fax</h3>
                    <p className='mt-1 text-sm text-gray-600'>7002330896</p>
                  </div>
                </div>
              </div>

              {/* 24/7 Support Banner */}
              <div className='mt-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white'>
                <div className='flex items-center space-x-3'>
                  <Icon name='AiOutlineClockCircle' className='h-6 w-6' />
                  <div>
                    <h3 className='font-semibold'>24/7 Support</h3>
                    <p className='text-sm opacity-90'>Call us anytime</p>
                  </div>
                </div>
                <p className='mt-2 text-lg font-bold'>+91-70023-30896</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h2 className='mb-6 text-2xl font-semibold text-gray-900'>Send Us a Message</h2>

              {/* <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <TextField
                    label='Full Name'
                    placeholder='Enter your full name'
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    required
                  />

                  <TextField
                    label='Email Address'
                    type='email'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    required
                  />
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <TextField
                    label='Phone Number'
                    placeholder='Enter your phone number'
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                  />

                  <TextField
                    label='Subject'
                    placeholder='What is this about?'
                    value={formData.subject}
                    onChange={(value) => handleInputChange('subject', value)}
                    required
                  />
                </div>

                <TextAreaField
                  label='Message'
                  placeholder='Tell us how we can help you...'
                  value={formData.message}
                  onChange={(value) => handleInputChange('message', value)}
                  rows={5}
                  required
                />

                <Button type='submit' disabled={isLoading} className='w-full md:w-auto'>
                  {isLoading ? (
                    <div className='flex items-center'>
                      <Icon name='AiOutlineLoading' className='mr-2 h-4 w-4 animate-spin' />
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form> */}
              <p className='text-md'>ambarikh11@gmail.com</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-16'>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-8 text-center text-2xl font-semibold text-gray-900'>People usually ask these</h2>

            <div className='space-y-4'>
              {faqData.map((faq, index) => (
                <div key={index} className='rounded-lg border border-gray-200'>
                  <button
                    onClick={() => toggleFaq(index)}
                    className='flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50'
                  >
                    <span className='font-medium text-gray-900'>{faq.question}</span>
                    <Icon
                      name={activeFaq === index ? 'AiOutlineMinus' : 'AiOutlinePlus'}
                      className='h-5 w-5 text-gray-500'
                    />
                  </button>

                  {activeFaq === index && (
                    <div className='px-6 pb-4'>
                      <p className='leading-relaxed text-gray-600'>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='mt-16'>
          <div className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white'>
            <h2 className='mb-4 text-2xl font-semibold'>Subscribe To Our Newsletter</h2>
            <p className='mb-6 text-blue-100'>Get all the latest information on Events, Sales and Offers.</p>

            <div className='mx-auto flex max-w-md space-x-4'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white'
              />
              <Button label='SUBSCRIBE' className='text-blue-600 hover:bg-gray-100' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
