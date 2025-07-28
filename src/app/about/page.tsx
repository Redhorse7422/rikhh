'use client'

import React from 'react'

import Image from 'next/image'

const teamMembers = [
  {
    name: 'AFFAN WAHEED',
    role: 'President & Founder',
    image: '/images/team/affan.webp',
    bio: 'Affan Waheed is an expert in operations, team building, and finance, he has successfully established international teams in e-commerce and logistics across 20+ countries. A skilled strategist and negotiator, Affan excels in P&L management, business relations, and organizational development, making him a standout leader in the tech industry.',
  },
  {
    name: 'TAREK MAZLOUM',
    role: 'CEO & Founder',
    image: '/images/team/tarek.jpg',
    bio: 'Tarek is a business executive and has a proven track record with major corporations leading to his current role as the Founder and CEO of Cann Group.',
  },
  {
    name: 'Dr. JOSEPH YAZDI',
    role: 'CMO & Partner',
    image: '/images/team/yazdi.webp',
    bio: 'Dr. Joseph Yazdi is a board certified Neurosurgeon from St. Louis with over 30 years of experience in complex spine surgery, minimally invasive procedures, concussion evaluation and treatment. He is one of the founding members of the Cann Group. Dr. Yazdi envisions the Cann Group to be a part of the global supply chain network.',
  },
  {
    name: 'Ali Ashraf',
    role: 'Senior Vice President',
    image: '/images/team/ali.jpg',
    bio: 'Ali is a PhD scholar and an accomplished communication and business strategist. He has successfully transformed numerous products into well-known brands and has served as a communication strategist for several global brands.',
  },
]

const AboutPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      {/* About Us Section */}
      <section className='mx-auto mb-20 max-w-4xl px-4 text-center'>
        <h1 className='mb-4 text-4xl font-bold text-primary'>About Us</h1>
        <p className='mb-6 text-lg text-gray-700'>
          Welcome to Aura Well USA! We are dedicated to providing the best products and customer experience. Our mission
          is to innovate, inspire, and deliver quality at every step. With a passionate team and a customer-first
          mindset, we strive to make a positive impact in every interaction.
        </p>
        <div className='mx-auto h-1 w-24 rounded-full bg-secondary/60'></div>
      </section>

      {/* Team Section */}
      <section className='mx-auto max-w-6xl px-4'>
        <h2 className='mb-10 text-center text-3xl font-bold text-primary'>Meet Our Team</h2>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className='flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl'
            >
              <div className='relative mb-4 h-28 w-28'>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className='rounded-full border-4 border-primary/20 object-cover shadow-md'
                />
              </div>
              <h3 className='text-xl font-semibold text-gray-900'>{member.name}</h3>
              <p className='mb-2 font-medium text-primary'>{member.role}</p>
              <p className='text-sm text-gray-600'>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
