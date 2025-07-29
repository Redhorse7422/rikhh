'use client'

import type { AddToCartDto } from '@/services/cart.services'
import type { Product } from '@/types/common'

import React, { useState, useEffect } from 'react'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import useToast from '@/hooks/useToast'

import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductTabs } from './components/ProductTabs'

// Extended Product interface to match Firebase response
export interface FirebaseProduct extends Product {
  sellerId: string
  thumbnailImg: string
  images: string[]
  sizes: string[] // Add sizes array
  lat: number
  lng: number
  description: string
}

interface ProductDetailPageProps {
  product: FirebaseProduct
  isLoading: boolean
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, isLoading = false }) => {
  const { showToast } = useToast()
  console.log('Product ===> ', product)

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [mainImage, setMainImage] = useState(product.thumbnailImg || product.images?.[0] || '')
  const [activeTab, setActiveTab] = useState('description')

  // Reset selected size when product changes
  useEffect(() => {
    setSelectedSize('')
  }, [product.id])

  // Convert Firebase images to ProductImage format
  const getAllImages = () => {
    const images = []

    // Add thumbnail image
    if (product.thumbnailImg) {
      images.push({
        id: 'thumbnail',
        url: product.thumbnailImg,
        alt: product.name,
        isMain: true,
      })
    }

    // Add additional images
    if (product.images && product.images.length > 0) {
      product.images.forEach((imageUrl, index) => {
        if (imageUrl !== product.thumbnailImg) {
          images.push({
            id: `image-${index}`,
            url: imageUrl,
            alt: `${product.name} - Image ${index + 1}`,
            isMain: false,
          })
        }
      })
    }

    return images
  }

  const images = getAllImages()

  const handleImageChange = (image: any) => {
    setMainImage(image.url)
  }

  const handleQuantityChange = (quantity: number) => {
    const maxQuantity = product.inStock ? 99 : 0 // Assuming max 99 items
    setSelectedQuantity(Math.max(1, Math.min(quantity, maxQuantity)))
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  const handleAddToCart = async () => {
    try {
      if (!product.inStock) {
        showToast('Product is out of stock', 'error')
        return
      }

      if (selectedQuantity <= 0) {
        showToast('Please select a quantity', 'error')
        return
      }

      // Check if size is required but not selected
      const hasSizes = product.sizes && product.sizes.length > 0
      if (hasSizes && !selectedSize) {
        showToast('Please select a size', 'error')
        return
      }

      const finalPrice = product.salePrice || product.regularPrice

      const dto: AddToCartDto = {
        productId: product.id,
        quantity: selectedQuantity,
        price: finalPrice,
        variants: selectedSize
          ? [
              {
                attributeId: 'size',
                attributeValueId: selectedSize,
                attributeName: 'Size',
                attributeValue: selectedSize,
              },
            ]
          : undefined,
      }

      // TODO: Implement cart functionality
      showToast(`${product.name} added to cart!`, 'success')
      setSelectedQuantity(1)
      setSelectedSize('')
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Failed to add item to cart', 'error')
    }
  }

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist logic
    console.log('Adding to wishlist:', product.name)
    showToast('Added to wishlist!', 'success')
  }

  const handleShare = () => {
    // TODO: Implement share logic
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      showToast('Link copied to clipboard!', 'success')
    }
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
          <ProductGallery images={images} mainImage={mainImage} onImageChange={handleImageChange} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            selectedQuantity={selectedQuantity}
            selectedSize={selectedSize}
            onQuantityChange={handleQuantityChange}
            onSizeChange={handleSizeChange}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onShare={handleShare}
          />
        </div>

        {/* Product Tabs */}
        <div className='mt-16'>
          <ProductTabs product={product} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  )
}
