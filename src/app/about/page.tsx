'use client'

import React from 'react'

import Image from 'next/image'

const AboutPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      {/* About Us Section */}
      <section className='mx-auto mb-20 max-w-4xl px-4 text-center'>
        <h1 className='mb-4 text-4xl font-bold text-primary'>About Us</h1>
        <h2 className='mb-4 text-4xl font-bold text-secondary'>
          We’re Devoted Marketing Consultants Helping Your Business Grow
        </h2>
        <p className='mb-6 text-lg text-gray-700'>
          About Rikhh, where we are passionate about empowering businesses to thrive. With our expertise and dedication,
          we serve as trusted partners in your growth journey. From crafting tailored marketing strategies to
          implementing impactful campaigns, we are devoted to helping your business reach its full potential. Join hands
          with us and lets drive your success together. At Rikhh, innovation meets excellence, ensuring you stay ahead
          in a competitive market. Our team of experts is committed to delivering results that matter. Together, we can
          turn your vision into reality. Lets embark on this exciting journey and achieve greatness together.
        </p>
        <div className='mx-auto h-1 w-24 rounded-full bg-secondary/60'></div>
      </section>
    </div>
  )
}

export default AboutPage
