import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import { getDocs, collectionGroup, query, where, orderBy, startAfter, limit } from 'firebase/firestore'

import { db } from '@/libs/firebase/config'
import { FirestoreService } from '@/libs/firebase/firestore'

// Product interface for Firestore
interface FirestoreProduct extends Omit<FirebaseProduct, 'id'> {
  id?: string
  createdAt?: any
  updatedAt?: any
}

interface ProductListResponse {
  data: FirebaseProduct[]
  nextCursor: any
  hasNextPage: boolean
}

class ProductFirebaseService extends FirestoreService<FirestoreProduct> {
  constructor() {
    super('products')
  }

  async getAllProducts({
    limit: limitCount = 10,
    lastVisible,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    limit?: number
    lastVisible?: any // the value of the last visible document's sort field
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<ProductListResponse> {
    try {
      let q = query(collectionGroup(db, 'products'))

      // 🔍 Apply Filters
      if (category) {
        q = query(q, where('category', '==', category))
      }
      if (minPrice !== undefined) {
        q = query(q, where('price', '>=', minPrice))
      }
      if (maxPrice !== undefined) {
        q = query(q, where('price', '<=', maxPrice))
      }

      // ⬆️ Sorting
      q = query(q, orderBy(sortBy, sortOrder))

      // ⏭️ Pagination
      if (lastVisible) {
        q = query(q, startAfter(lastVisible))
      }

      // 🎯 Limit
      q = query(q, limit(limitCount))

      const snapshot = await getDocs(q)

      const products = snapshot.docs.map((doc) => {
        const data = doc.data() as any
        const product = {
          id: doc.id,
          name: data.name || data.productName,
          slug: (data.name || data.productName)?.toLowerCase().replace(/\s+/g, '-') || doc.id,
          regularPrice: data.regularPrice || data.price,
          salePrice: data.salePrice || data.price,
          rating: data.rating || 4.5,
          reviews: data.reviews || 0,
          thumbnailImg: data.thumbnailImg || data.images?.[0] || '/images/no-image.png',
          description: data.description,
          category: data.category,
          inStock: data.inStock !== undefined ? data.inStock : true,
          sellerId: data.sellerId,
          images: data.images || (data.thumbnailImg ? [data.thumbnailImg] : []),
          sizes: data.sizes || [], // Add sizes array
          lat: data.lat,
          lng: data.lng,
        } as FirebaseProduct

        return product
      })

      const nextCursor = snapshot.docs[snapshot.docs.length - 1]?.get(sortBy)

      return {
        data: products,
        nextCursor: nextCursor ?? null,
        hasNextPage: snapshot.docs.length === limitCount,
      }
    } catch (error) {
      console.error('Error fetching paginated products:', error)
      return {
        data: [],
        nextCursor: null,
        hasNextPage: false,
      }
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<FirebaseProduct | null> {
    try {
      // Use collection group query to search across all subcollections
      // We need to get all products and filter by ID since we can't query by document ID directly
      const productsQuery = collectionGroup(db, 'products')
      const productsSnapshot = await getDocs(productsQuery)

      // Find the document with matching ID
      const targetDoc = productsSnapshot.docs.find((doc) => doc.id === id)

      if (!targetDoc) {
        return null
      }

      const data = targetDoc.data() as any

      return {
        id: targetDoc.id,
        name: data.name || data.productName,
        slug: (data.name || data.productName)?.toLowerCase().replace(/\s+/g, '-') || targetDoc.id,
        regularPrice: data.regularPrice || data.price,
        salePrice: data.salePrice || data.price,
        rating: data.rating || 4.5,
        reviews: data.reviews || 0,
        thumbnailImg: data.thumbnailImg || data.images?.[0] || '/images/no-image.png',
        description: data.description,
        category: data.category,
        inStock: data.inStock !== undefined ? data.inStock : true,
        sellerId: data.sellerId,
        images: data.images || (data.thumbnailImg ? [data.thumbnailImg] : []),
        sizes: data.sizes || [],
        lat: data.lat,
        lng: data.lng,
      } as FirebaseProduct
    } catch (error) {
      console.error('❌ Error fetching product by ID:', error)
      return null
    }
  }

  // Create new product
  async createProduct(productData: Omit<FirebaseProduct, 'id'>): Promise<string> {
    return this.create(productData)
  }

  // Update product
  async updateProduct(id: string, productData: Partial<FirebaseProduct>): Promise<void> {
    await this.update(id, productData)
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await this.delete(id)
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<FirebaseProduct[]> {
    try {
      const allProducts = await this.getAllProducts({ limit: 1000 })
      return allProducts.data.filter((product) => product.category === category)
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  // Get featured products
  async getFeaturedProducts(limt: number = 10): Promise<FirebaseProduct[]> {
    try {
      const allProducts = await this.getAllProducts({ limit: 50 }) // Get more products to filter from

      // For now, return the first 'limit' products as featured
      // You can add a 'featured' field to your products later
      return allProducts.data.slice(0, limt)
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  // Search products with server-side pagination using array_contains
  // async searchProducts(
  //   qr: string,
  //   {
  //     limit: limitCount = 10,
  //     lastVisible,
  //     sortBy = 'createdAt',
  //     sortOrder = 'desc',
  //   }: {
  //     limit?: number
  //     lastVisible?: any
  //     sortBy?: string
  //     sortOrder?: 'asc' | 'desc'
  //   } = {},
  // ): Promise<ProductListResponse> {
  //   try {
  //     // Server-side search using Firestore queries with array_contains
  //     // This matches the Firebase console query structure you showed

  //     // Create base query
  //     // let q = query(collectionGroup(db, 'products'))

  //     // Add search filters using array_contains for productName
  //     // if (qr && qr.trim()) {
  //     //   // Use array_contains to search within the productName array
  //     //   // This assumes your products have a productName field that contains an array of searchable terms
  //     //   // q = query(q, where('productName', 'array-contains', qr.toLowerCase().trim()))
  //     //   q = query(q, where('productName', '>=', qr.toLowerCase().trim()))
  //     // }

  //     const searchTerm = qr.toLowerCase().trim()

  //     let q = query(
  //       collectionGroup(db, 'products'),
  //       orderBy('productName'),
  //       where('productName', '>=', searchTerm),
  //       // where('productName', '<=', searchTerm + '\uf8ff'),
  //     )

  //     // Add sorting
  //     q = query(q, orderBy(sortBy, sortOrder))

  //     // Add pagination
  //     if (lastVisible) {
  //       q = query(q, startAfter(lastVisible))
  //     }

  //     // Add limit
  //     q = query(q, limit(limitCount))

  //     const snapshot = await getDocs(q)

  //     const products = snapshot.docs.map((doc) => {
  //       const data = doc.data() as any
  //       const product = {
  //         id: doc.id,
  //         name: data.name || data.productName,
  //         slug: (data.name || data.productName)?.toLowerCase().replace(/\s+/g, '-') || doc.id,
  //         regularPrice: data.regularPrice || data.price,
  //         salePrice: data.salePrice || data.price,
  //         rating: data.rating || 4.5,
  //         reviews: data.reviews || 0,
  //         thumbnailImg: data.thumbnailImg || data.images?.[0] || '/images/no-image.png',
  //         description: data.description,
  //         category: data.category,
  //         inStock: data.inStock !== undefined ? data.inStock : true,
  //         sellerId: data.sellerId,
  //         images: data.images || (data.thumbnailImg ? [data.thumbnailImg] : []),
  //         sizes: data.sizes || [],
  //         lat: data.lat,
  //         lng: data.lng,
  //       } as FirebaseProduct

  //       return product
  //     })

  //     const nextCursor = snapshot.docs[snapshot.docs.length - 1]?.get(sortBy)

  //     return {
  //       data: products,
  //       nextCursor: nextCursor ?? null,
  //       hasNextPage: snapshot.docs.length === limitCount,
  //     }
  //   } catch (error) {
  //     console.error('Error searching products:', error)
  //     return {
  //       data: [],
  //       nextCursor: null,
  //       hasNextPage: false,
  //     }
  //   }
  // }

  async searchProducts(
    qr: string,
    {
      limit: limitCount = 10,
      lastVisible,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    }: {
      limit?: number
      lastVisible?: any
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    } = {},
  ): Promise<ProductListResponse> {
    try {
      const searchTerm = qr.toLowerCase().trim()

      // Create base query with prefix search
      let q = query(
        collectionGroup(db, 'products'),
        where('productName', '>=', searchTerm),
        // where('productName', '<=', searchTerm + '\uf8ff'),
        orderBy('productName', 'asc'), // Single orderBy for prefix search
      )

      // Add pagination
      if (lastVisible) {
        q = query(q, startAfter(lastVisible))
      }

      // Add limit
      q = query(q, limit(limitCount))

      const snapshot = await getDocs(q)

      const products = snapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          name: data.name || data.productName,
          slug: (data.name || data.productName)?.toLowerCase().replace(/\s+/g, '-') || doc.id,
          regularPrice: data.regularPrice || data.price,
          salePrice: data.salePrice || data.price,
          rating: data.rating || 4.5,
          reviews: data.reviews || 0,
          thumbnailImg: data.thumbnailImg || data.images?.[0] || '/images/no-image.png',
          description: data.description,
          category: data.category,
          inStock: data.inStock !== undefined ? data.inStock : true,
          sellerId: data.sellerId,
          images: data.images || (data.thumbnailImg ? [data.thumbnailImg] : []),
          sizes: data.sizes || [],
          lat: data.lat,
          lng: data.lng,
        } as FirebaseProduct
      })

      const nextCursor = snapshot.docs[snapshot.docs.length - 1]?.get('productName')

      return {
        data: products,
        nextCursor: nextCursor ?? null,
        hasNextPage: snapshot.docs.length === limitCount,
      }
    } catch (error) {
      console.error('Error searching products:', error)
      return {
        data: [],
        nextCursor: null,
        hasNextPage: false,
      }
    }
  }

  // Get search count using server-side query with prefix search
  async getSearchCount(qr: string): Promise<number> {
    try {
      const searchTerm = qr.toLowerCase().trim()

      // Use the same prefix search approach as searchProducts
      const q = query(
        collectionGroup(db, 'products'),
        where('productName', '>=', searchTerm),
        // where('productName', '<=', searchTerm + '\uf8ff'),
        orderBy('productName', 'asc'),
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.length
    } catch (error) {
      console.error('Error getting search count:', error)
      return 0
    }
  }
}

export const productFirebaseService = new ProductFirebaseService()
