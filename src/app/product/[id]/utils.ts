import { productFirebaseService } from '@/services/firebase/products.firebase'

export async function fetchProductById(id: string) {
  try {
    const product = await productFirebaseService.getProductById(id)

    if (product) {
      return product
    }

    return null
  } catch (e) {
    return null
  }
}
