'use client'

import type { Product, AppliedFilters } from '@/types/common'

import React, { useState } from 'react'

import { CategoryHeader, FilterSidebar, ProductsToolbar, ProductsGrid, MobileFilterModal } from './components'
interface CategoryDetailPageProps {
  categoryName: string
  categoryImage: string
  productCount: string
}

// Mock data for products in the category
const mockProducts: Product[] = [
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
  {
    id: 5,
    name: 'USB-C Cable Set',
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.2,
    reviews: 95,
    image: '/images/product/product-01.png',
    badge: 'Sale',
  },
  {
    id: 6,
    name: 'Phone Stand',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.4,
    reviews: 67,
    image: '/images/product/product-02.png',
  },
  {
    id: 7,
    name: 'Screen Protector',
    price: 12.99,
    originalPrice: 19.99,
    rating: 4.1,
    reviews: 234,
    image: '/images/product/product-03.png',
  },
  {
    id: 8,
    name: 'Power Bank',
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviews: 178,
    image: '/images/product/product-04.png',
    badge: 'Popular',
  },
]

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categoryName,
  categoryImage,
  productCount,
}) => {
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<AppliedFilters>({})

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev: any) => {
      const current = prev[filterType] || []
      const updated = current.includes(value) ? current.filter((v: any) => v !== value) : [...current, value]

      return {
        ...prev,
        [filterType]: updated.length > 0 ? updated : [],
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more products')
  }

  const activeFiltersCount = Object.values(selectedFilters).flat().length

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <CategoryHeader categoryName={categoryName} categoryImage={categoryImage} productCount={productCount} />

      <div className='max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Filters Sidebar - Desktop */}
          <div className='hidden lg:block'>
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Section */}
          <div className='flex-1'>
            {/* Toolbar */}
            <ProductsToolbar
              sortBy={sortBy}
              onSortChange={setSortBy}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
              activeFiltersCount={activeFiltersCount}
              productCount={mockProducts.length}
            />

            {/* Products Grid */}
            <ProductsGrid products={mockProducts} onLoadMore={handleLoadMore} hasMoreProducts={true} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  )
}
