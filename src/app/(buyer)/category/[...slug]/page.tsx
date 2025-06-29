import React from 'react'

import { CategoryDetailPage } from '@/components/Pages/Buyer/CategoryDetailPage'
// Mock category data - in a real app, this would come from an API
const categoryData = {
  electronics: {
    name: 'Electronics',
    image: '/images/cards/cards-01.png',
    productCount: '2.5k+ products',
  },
  fashion: {
    name: 'Fashion',
    image: '/images/cards/cards-02.png',
    productCount: '1.8k+ products',
  },
  'home-garden': {
    name: 'Home & Garden',
    image: '/images/cards/cards-03.png',
    productCount: '1.2k+ products',
  },
  sports: {
    name: 'Sports',
    image: '/images/cards/cards-04.png',
    productCount: '950+ products',
  },
  books: {
    name: 'Books',
    image: '/images/cards/cards-01.png',
    productCount: '750+ products',
  },
  health: {
    name: 'Health',
    image: '/images/cards/cards-02.png',
    productCount: '600+ products',
  },
  toys: {
    name: 'Toys',
    image: '/images/cards/cards-03.png',
    productCount: '450+ products',
  },
  automotive: {
    name: 'Automotive',
    image: '/images/cards/cards-04.png',
    productCount: '300+ products',
  },
  beauty: {
    name: 'Beauty',
    image: '/images/cards/cards-01.png',
    productCount: '800+ products',
  },
  food: {
    name: 'Food',
    image: '/images/cards/cards-02.png',
    productCount: '400+ products',
  },
}
type Props = {
  params: { slug: string[] }
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  // Unwrap params using React.use() for Next.js 15 compatibility
  const slugArray = (await params).slug
  const slug = slugArray.join('/')
  const category = categoryData[slug as keyof typeof categoryData]

  if (!category) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Category Not Found</h1>
          <p className='text-gray-600'>The category you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <CategoryDetailPage
      categoryName={category.name}
      categoryImage={category.image}
      productCount={category.productCount}
    />
  )
}
