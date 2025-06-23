'use client'

import { ProductFilterProvider } from './ProductFilterContext'
import { SectionFilter } from './SectionFilter'
import { SectionProducts } from './sectionProducts'

export const AdminProductsPage = () => {
  return (
    <ProductFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionProducts />
      </div>
    </ProductFilterProvider>
  )
}
