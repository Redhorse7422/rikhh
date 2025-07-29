import type { Category } from '@/types/common'

import { getDocs, collectionGroup } from 'firebase/firestore'

import { db } from '@/libs/firebase/config'
import { FirestoreService } from '@/libs/firebase/firestore'

// Product interface for Firestore
interface FirestoreCategory extends Omit<Category, 'id'> {
  id?: string
  createdAt?: any
  updatedAt?: any
}

export interface FirebaseCategory extends Category {
  sellerId: string
  images: string[]
  lat: number
  lng: number
  description: string
}

interface CategoryListResponse {
  data: FirebaseCategory[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

class CategoryFirebaseService extends FirestoreService<FirebaseCategory> {
  constructor() {
    super('categories')
  }

  // Get products from all sellers (aggregated)
  async getAllCategories(
    params: {
      page?: number
      limit?: number
      search?: string
      category?: string
      minPrice?: number
      maxPrice?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    } = {},
  ): Promise<CategoryListResponse> {
    const { page = 1, limit: itemsPerPage = 10, search, category, minPrice, maxPrice, sortBy, sortOrder } = params

    try {
      console.log('🔍 Fetching products with Collection Group Query...')

      // Use Collection Group Query to get all products from all sellers
      const productsQuery = collectionGroup(db, 'categories')
      const productsSnapshot = await getDocs(productsQuery)

      console.log(`✅ Found ${productsSnapshot.docs.length} categories total`)

      const allProducts = productsSnapshot.docs.map((doc) => {
        const data = doc.data() as any
        // Extract seller ID from the document path
        const pathParts = doc.ref.path.split('/')
        const sellerId = pathParts[1] // sellers/{sellerId}/products/{productId}

        const product = {
          id: doc.id,
          sellerId,
          ...data,
        } as any

        // Debug: Log the first product's raw data
        if (doc.id === productsSnapshot.docs[0]?.id) {
          console.log('🔍 Raw category data from Firestore:', {
            id: product.id,
            productName: product.productName,
            name: product.name,
            images: product.images,
            imageUrls: product.imageUrls,
            thumbnail: product.thumbnail,
            thumbnailImg: product.thumbnailImg,
            allKeys: Object.keys(product),
          })
        }

        return product
      })

      // Apply filters
      let filteredProducts = allProducts

      if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category === category)
        console.log(`📂 Filtered by category "${category}": ${filteredProducts.length} products`)
      }

      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((product) => product.price >= minPrice)
        console.log(`💰 Filtered by min price ${minPrice}: ${filteredProducts.length} products`)
      }

      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice)
        console.log(`💰 Filtered by max price ${maxPrice}: ${filteredProducts.length} products`)
      }

      if (search) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.description?.toLowerCase().includes(search.toLowerCase()),
        )
        console.log(`🔍 Filtered by search "${search}": ${filteredProducts.length} products`)
      }

      // Sort products
      filteredProducts.sort((a, b) => {
        const aValue = a[sortBy || 'createdAt']
        const bValue = b[sortBy || 'createdAt']

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      })

      // Manual pagination
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      console.log(`📄 Returning ${paginatedProducts.length} products for page ${page}`)

      return {
        data: paginatedProducts.map((product) => {
          const mappedProduct = {
            id: product.id,
            name: product.name || product.productName,
            slug: (product.name || product.productName)?.toLowerCase().replace(/\s+/g, '-') || product.id,
            // regularPrice: product.regularPrice || product.price,
            // salePrice: product.salePrice || product.price,
            // rating: product.rating || 4.5, // Default rating
            // reviews: product.reviews || 0, // Default reviews
            // thumbnailImg: product.thumbnailImg || product.images?.[0] || '/images/no-image.png',
            description: product.description,
            // category: product.category,
            // inStock: product.inStock !== undefined ? product.inStock : true,
            // sellerId: product.sellerId,
            // images: product.images || (product.thumbnailImg ? [product.thumbnailImg] : []),
            // lat: product.lat,
            // lng: product.lng,
          } as FirebaseCategory

          // Debug: Log the first mapped product
          if (product.id === paginatedProducts[0]?.id) {
            console.log('🔄 Mapped product data:', {
              originalImages: product.images,
              // mappedThumbnailImg: mappedProduct.thumbnailImg,
              mappedImages: mappedProduct.images,
              hasImages: !!product.images,
              imagesLength: product.images?.length || 0,
            })
          }

          return mappedProduct
        }) as FirebaseCategory[],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / itemsPerPage),
          totalItems: filteredProducts.length,
          itemsPerPage: itemsPerPage,
          hasNextPage: endIndex < filteredProducts.length,
          hasPrevPage: page > 1,
        },
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<FirebaseCategory | null> {
    const category = await this.getById(id)

    if (!category) return null

    return {
      ...category,
      id: category.id || '',
    } as FirebaseCategory
  }

  // Create new category
  async createCategory(categoryData: Omit<FirebaseCategory, 'id'>): Promise<string> {
    return this.create(categoryData)
  }

  // Update category
  async updateCategory(id: string, categoryData: Partial<FirebaseCategory>): Promise<void> {
    await this.update(id, categoryData)
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await this.delete(id)
  }
}

export const categoryFirebaseService = new CategoryFirebaseService()
