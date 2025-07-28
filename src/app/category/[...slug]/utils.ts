import { productFirebaseService } from '@/services/firebase/products.firebase'

export const fetchCategoryDetailBySlug = async (catSlug: string) => {
  // TODO: Implement category fetching from Firebase
  // For now, return null as categories are not yet implemented
  return null
}

export const fetchProductsByCategory = async (catId: string) => {
  try {
    const products = await productFirebaseService.getProductsByCategory(catId)
    return {
      data: {
        code: 0,
        data: products,
        message: 'Success',
      },
    }
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return null
  }
}
