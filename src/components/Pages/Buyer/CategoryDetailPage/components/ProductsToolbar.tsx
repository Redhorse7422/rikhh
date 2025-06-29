import type { SortOption } from '@/types/common'

import React from 'react'

import { FilterIcon } from '@/assets/icons'

interface ProductsToolbarProps {
  sortBy: string
  onSortChange: (value: string) => void
  onToggleFilters: () => void
  showFilters: boolean
  activeFiltersCount: number
  productCount: number
}

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
]

export const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  sortBy,
  onSortChange,
  onToggleFilters,
  showFilters,
  activeFiltersCount,
  productCount,
}) => {
  return (
    <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={onToggleFilters}
            className='flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 lg:hidden'
          >
            <FilterIcon className='h-4 w-4' />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className='rounded-full bg-primary px-2 py-1 text-xs text-white'>{activeFiltersCount}</span>
            )}
          </button>
          <span className='text-sm text-gray-600'>{productCount} products</span>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-600'>Sort by: </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary'
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
