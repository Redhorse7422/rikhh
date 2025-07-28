import { productFirebaseService } from '@/services/firebase/products.firebase'

export async function fetchProductBySlug(slug: string) {
  try {
    console.log('🔍 Fetching product by slug:', slug)
    
    // First try to get by slug
    let product = await productFirebaseService.getProductBySlug(slug)
    
    // If not found by slug, try to get by ID (in case slug is actually an ID)
    if (!product) {
      console.log('⚠️ Product not found by slug, trying by ID...')
      product = await productFirebaseService.getProductById(slug)
    }
    
    if (product) {
      console.log('✅ Product found:', product.name)
      return product
    }
    
    console.log('❌ Product not found')
    return null
  } catch (e) {
    console.error('❌ Error fetching product:', e)
    return null
  }
}
