'use client'

import type { Category } from '@/types/common'

import React, { useState, useRef, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons'
interface CategorySliderProps {
  categories: Category[]
}

export const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [categoriesPerPage, setCategoriesPerPage] = useState(4)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Calculate categories per page based on container width with max of 8
  useEffect(() => {
    const updateCategoriesPerPage = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth
        // Each category takes approximately 120px (96px image + 24px gap)
        const calculatedPerPage = Math.floor(containerWidth / 120)
        // Limit to maximum 8 items per screen
        const limitedPerPage = Math.min(calculatedPerPage, 8)
        setCategoriesPerPage(Math.max(1, limitedPerPage))
      }
    }

    updateCategoriesPerPage()
    window.addEventListener('resize', updateCategoriesPerPage)
    return () => window.removeEventListener('resize', updateCategoriesPerPage)
  }, [])

  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  const scrollToNext = () => {
    if (sliderRef.current && currentPage < totalPages - 1) {
      const nextPage = currentPage + 1
      const scrollPosition = nextPage * sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      setCurrentPage(nextPage)
    }
  }

  const scrollToPrev = () => {
    if (sliderRef.current && currentPage > 0) {
      const prevPage = currentPage - 1
      const scrollPosition = prevPage * sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      setCurrentPage(prevPage)
    }
  }

  const scrollToPage = (pageIndex: number) => {
    if (sliderRef.current) {
      const scrollPosition = pageIndex * sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      setCurrentPage(pageIndex)
    }
  }

  // Handle scroll events to update current page
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const scrollLeft = sliderRef.current.scrollLeft
        const containerWidth = sliderRef.current.offsetWidth
        const newPage = Math.round(scrollLeft / containerWidth)
        if (newPage !== currentPage) {
          setCurrentPage(newPage)
        }
      }
    }

    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', handleScroll, { passive: true })
      return () => slider.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage])

  return (
    <div className='relative overflow-hidden'>
      {/* Navigation Buttons */}
      <button
        onClick={scrollToPrev}
        disabled={currentPage === 0}
        className='absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
      </button>

      <button
        onClick={scrollToNext}
        disabled={currentPage === totalPages - 1}
        className='absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <ArrowRightIcon className='h-5 w-5 text-gray-600' />
      </button>

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className='flex overflow-x-auto no-scrollbar'
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {categories.map((category, index) => (
          <div
            key={category.name}
            className='flex-shrink-0 px-3'
            style={{
              scrollSnapAlign: 'start',
              width: `${100 / categoriesPerPage}%`,
              minWidth: `${100 / categoriesPerPage}%`,
            }}
          >
            <Link href={category.href} className='group block'>
              <div className='flex flex-col items-center space-y-3'>
                {/* Rounded Image Container */}
                <div className='relative h-30 w-30 overflow-hidden rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 p-1 transition-transform duration-300 group-hover:scale-110'>
                  <div className='relative h-full w-full overflow-hidden rounded-full'>
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    {/* Overlay */}
                    <div className='absolute inset-0 rounded-full bg-black/20 transition-opacity group-hover:bg-black/30' />
                  </div>
                </div>

                {/* Category Info */}
                <div className='text-center'>
                  <h3 className='font-semibold text-gray-900 transition-colors group-hover:text-primary'>
                    {category.name}
                  </h3>
                  <p className='text-sm text-gray-500'>{category.count}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Dots Indicator - One dot per page */}
      <div className='mt-6 flex justify-center space-x-2'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => scrollToPage(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentPage ? 'w-6 bg-primary' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
