'use client'

import type { Category } from '@/types/common'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/assets/icons'
import { CategorySlider } from '@/components/common/products/CategorySlider'
import { ProductCard } from '@/components/common/products/ProductCard'
// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 128,
    image: '/images/product/product-01.png',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 89,
    image: '/images/product/product-02.png',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.3,
    reviews: 156,
    image: '/images/product/product-03.png',
    badge: 'Sale',
  },
  {
    id: 4,
    name: 'Wireless Charging Pad',
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviews: 203,
    image: '/images/product/product-04.png',
    badge: 'Popular',
  },
]

const categories = [
  { name: 'Electronics', image: '/images/cards/cards-01.png', href: '/category/electronics', count: '2.5k+ products' },
  { name: 'Fashion', image: '/images/cards/cards-02.png', href: '/category/fashion', count: '1.8k+ products' },
  {
    name: 'Home & Garden',
    image: '/images/cards/cards-03.png',
    href: '/category/home-garden',
    count: '1.2k+ products',
  },
  { name: 'Sports', image: '/images/cards/cards-04.png', href: '/category/sports', count: '950+ products' },
  { name: 'Books', image: '/images/cards/cards-01.png', href: '/category/books', count: '750+ products' },
  { name: 'Health', image: '/images/cards/cards-02.png', href: '/category/health', count: '600+ products' },
  { name: 'Toys', image: '/images/cards/cards-03.png', href: '/category/toys', count: '450+ products' },
  { name: 'Automotive', image: '/images/cards/cards-04.png', href: '/category/automotive', count: '300+ products' },
  { name: 'Beauty', image: '/images/cards/cards-01.png', href: '/category/beauty', count: '800+ products' },
  { name: 'Food', image: '/images/cards/cards-02.png', href: '/category/food', count: '400+ products' },
  { name: 'Toys1', image: '/images/cards/cards-03.png', href: '/category/toys', count: '450+ products' },
  { name: 'Automotive1', image: '/images/cards/cards-04.png', href: '/category/automotive', count: '300+ products' },
]

export const BuyerHomePage: React.FC = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-primary to-primary/80 py-20 text-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div>
              <h1 className='mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
                Discover Amazing
                <span className='block text-secondary'>Products</span>
              </h1>
              <p className='mb-8 text-xl text-white/90'>
                Shop the latest trends and find your perfect style. Quality products at unbeatable prices.
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='/products'
                  className='inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-secondary/90'
                >
                  Shop Now
                  <ArrowRightIcon className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  href='/deals'
                  className='rounded-lg border border-white/30 bg-white/20 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/30'
                >
                  View Deals
                </Link>
              </div>
            </div>
            <div className='relative'>
              <Image
                src='/images/cover/cover-01.png'
                alt='Hero Image'
                width={600}
                height={400}
                className='h-auto w-full'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='bg-gray-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>Shop by Category</h2>
            <p className='text-lg text-gray-600'>Find what you&apos;re looking for in our curated categories</p>
          </div>
          <CategorySlider categories={categories as Category[]} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 flex items-center justify-between'>
            <div>
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>Featured Products</h2>
              <p className='text-lg text-gray-600'>Handpicked products just for you</p>
            </div>
            <Link href='/products' className='flex items-center font-semibold text-primary hover:text-primary/80'>
              View All
              <ArrowRightIcon className='ml-1 h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className='bg-secondary py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-white'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Limited Time Offer</h2>
            <p className='mb-8 text-xl text-white/90'>
              Get up to 50% off on selected items. Don&apos;t miss out on these amazing deals!
            </p>
            <Link
              href='/deals'
              className='inline-flex items-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-secondary transition-colors hover:bg-gray-100'
            >
              Shop Deals
              <ArrowRightIcon className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='bg-gray-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold'>Stay in the Loop</h2>
          <p className='mb-8 text-xl text-gray-300'>
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
            offers.
          </p>
          <div className='mx-auto flex max-w-md flex-col gap-4 sm:flex-row'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary'
            />
            <button className='rounded-lg bg-primary px-8 py-3 font-semibold transition-colors hover:bg-primary/90'>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
