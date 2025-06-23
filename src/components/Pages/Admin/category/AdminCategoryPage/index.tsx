'use client'

import { CategoryFilterProvider } from './CategoryFilterContext'
import { SectionFilter } from './SectionFilter'
import { SectionCategories } from './sectionCategories'

export const AdminCategoryPage = () => {
  return (
    <CategoryFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionCategories />
      </div>
    </CategoryFilterProvider>
  )
}
