'use client'

import type { ProductDetail, ProductDetailPageProps } from '@/types/product'

import React, { useState } from 'react'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductTabs } from './components/ProductTabs'
import { RelatedProducts } from './components/RelatedProducts'

// Mock data for demonstration
const mockProduct: ProductDetail = {
  id: '1',
  name: 'Premium Wireless Bluetooth Headphones',
  salePrice: 89.99,
  regularPrice: 129.99,
  rating: 4.5,
  reviews: 128,
  image: '/images/product/product-01.png',
  thumbnailImg: '/images/product/product-01.png',
  badge: 'Best Seller',
  description: 'High-quality wireless headphones with noise cancellation',
  category: 'Electronics',
  tags: ['wireless', 'bluetooth', 'noise-cancelling'],
  inStock: true,
  sku: 'WH-001',
  weight: 0.5,
  dimensions: { length: 20, width: 15, height: 8 },
  longDescription: `
    Experience crystal-clear sound with our premium wireless Bluetooth headphones. 
    Featuring advanced noise cancellation technology, these headphones provide an 
    immersive listening experience whether you're commuting, working out, or just 
    relaxing at home. With up to 30 hours of battery life and quick charging, 
    you'll never miss a beat.
    
    Key Features:
    • Active Noise Cancellation
    • 30-hour battery life
    • Quick charge (10 min = 5 hours)
    • Premium build quality
    • Comfortable over-ear design
    • Built-in microphone for calls
  `,
  shortDescription: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
  brand: 'AudioTech',
  model: 'WH-2024',
  warranty: '2 years',
  returnPolicy: '30-day money-back guarantee',
  shippingInfo: 'Free shipping on orders over $50',
  images: [
    { id: '1', url: '/images/product/product-01.png', alt: 'Headphones front view', isMain: true },
    { id: '2', url: '/images/product/product-02.png', alt: 'Headphones side view', isMain: false },
    { id: '3', url: '/images/product/product-03.png', alt: 'Headphones in case', isMain: false },
    { id: '4', url: '/images/product/product-04.png', alt: 'Headphones with accessories', isMain: false },
  ],
  variants: [
    { id: '1', name: 'Color', value: 'Black', price: 89.99, inStock: true, sku: 'WH-001-BLK' },
    { id: '2', name: 'Color', value: 'White', price: 89.99, inStock: true, sku: 'WH-001-WHT' },
    { id: '3', name: 'Color', value: 'Blue', price: 94.99, inStock: false, sku: 'WH-001-BLU' },
  ],
  specifications: [
    { name: 'Driver Size', value: '40mm' },
    { name: 'Frequency Response', value: '20Hz - 20kHz' },
    { name: 'Impedance', value: '32Ω' },
    { name: 'Sensitivity', value: '105dB' },
    { name: 'Battery Life', value: '30 hours' },
    { name: 'Charging Time', value: '2 hours' },
    { name: 'Weight', value: '250g' },
    { name: 'Connectivity', value: 'Bluetooth 5.0' },
  ],
  productReviews: [
    {
      id: '1',
      userId: 'user1',
      userName: 'John D.',
      userAvatar: '/images/user/user-01.png',
      rating: 5,
      title: 'Excellent sound quality!',
      comment:
        'These headphones exceeded my expectations. The sound quality is amazing and the noise cancellation works perfectly.',
      createdAt: new Date('2024-01-15'),
      helpful: 12,
      verified: true,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah M.',
      userAvatar: '/images/user/user-02.png',
      rating: 4,
      title: 'Great headphones, minor issues',
      comment: 'Love the sound quality and battery life. The only downside is they can be a bit tight after long wear.',
      createdAt: new Date('2024-01-10'),
      helpful: 8,
      verified: true,
    },
  ],
  relatedProducts: [
    {
      id: '2',
      name: 'Wireless Earbuds',
      regularPrice: 59.99,
      salePrice: 79.99,
      rating: 4.3,
      reviews: 89,
      thumbnailImg: '/images/product/product-02.png',
      badge: 'New',
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      regularPrice: 39.99,
      salePrice: 59.99,
      rating: 4.1,
      reviews: 156,
      thumbnailImg: '/images/product/product-03.png',
      badge: 'Sale',
    },
  ],
  inWishlist: false,
  stockQuantity: 25,
  minOrderQuantity: 1,
  maxOrderQuantity: 10,
  isOnSale: true,
  saleEndDate: new Date('2024-12-31'),
  discountPercentage: 31,
  shippingWeight: 0.5,
  packageDimensions: { length: 22, width: 17, height: 10 },
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Quick charge technology',
    'Premium build quality',
    'Comfortable over-ear design',
    'Built-in microphone',
    'Bluetooth 5.0',
    'Touch controls',
  ],
  materials: ['Premium plastic', 'Memory foam', 'Aluminum accents'],
  colors: ['Black', 'White', 'Blue'],
  sizes: ['One Size'],
  availability: 'in-stock',
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product = mockProduct, isLoading = false }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product.images.find((img) => img.isMain) || product.images[0])
  const [activeTab, setActiveTab] = useState('description')

  const handleImageChange = (image: any) => {
    setMainImage(image)
  }

  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(Math.max(1, Math.min(quantity, product.maxOrderQuantity)))
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log('Adding to cart:', { product: product.name, quantity: selectedQuantity })
  }

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist logic
    console.log('Adding to wishlist:', product.name)
  }

  const handleShare = () => {
    // TODO: Implement share logic
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleLoadMoreReviews = () => {
    // TODO: Implement load more reviews logic
    console.log('Loading more reviews...')
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-8 h-4 w-1/4 rounded bg-gray-200'></div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <div className='h-96 rounded bg-gray-200'></div>
              <div className='space-y-4'>
                <div className='h-8 w-3/4 rounded bg-gray-200'></div>
                <div className='h-4 w-1/2 rounded bg-gray-200'></div>
                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='border-b bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
          <Breadcrumb pageName={product.name} />
        </div>
      </div>

      {/* Main Product Section */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {/* Product Gallery */}
          <ProductGallery images={product.images} mainImage={mainImage} onImageChange={handleImageChange} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            selectedQuantity={selectedQuantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onShare={handleShare}
          />
        </div>

        {/* Product Tabs */}
        <div className='mt-16'>
          <ProductTabs product={product} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Related Products */}
        <div className='mt-16'>
          <RelatedProducts products={product.relatedProducts} />
        </div>
      </div>
    </div>
  )
}
