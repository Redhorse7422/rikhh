import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

import { getDocs, collectionGroup } from 'firebase/firestore'

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
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

class ProductFirebaseService extends FirestoreService<FirestoreProduct> {
  constructor() {
    super('products')
  }

  // Get products from all sellers (aggregated)
  async getAllProducts(
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
  ): Promise<ProductListResponse> {
    const { page = 1, limit: itemsPerPage = 10, search, category, minPrice, maxPrice, sortBy, sortOrder } = params

    try {
      console.log('🔍 Fetching products with Collection Group Query...')

      // Use Collection Group Query to get all products from all sellers
      const productsQuery = collectionGroup(db, 'products')
      const productsSnapshot = await getDocs(productsQuery)

      console.log(`✅ Found ${productsSnapshot.docs.length} products total`)

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
          console.log('🔍 Raw product data from Firestore:', {
            id: product.id,
            productName: product.productName,
            name: product.name,
            images: product.images,
            imageUrls: product.imageUrls,
            thumbnail: product.thumbnail,
            thumbnailImg: product.thumbnailImg,
            allKeys: Object.keys(product)
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
            regularPrice: product.regularPrice || product.price,
            salePrice: product.salePrice || product.price,
            rating: product.rating || 4.5, // Default rating
            reviews: product.reviews || 0, // Default reviews
            thumbnailImg: product.thumbnailImg || product.images?.[0] || '/images/no-image.png',
            description: product.description,
            category: product.category,
            inStock: product.inStock !== undefined ? product.inStock : true,
            sellerId: product.sellerId,
            images: product.images || (product.thumbnailImg ? [product.thumbnailImg] : []),
            lat: product.lat,
            lng: product.lng,
          } as FirebaseProduct

          // Debug: Log the first mapped product
          if (product.id === paginatedProducts[0]?.id) {
            console.log('🔄 Mapped product data:', {
              originalImages: product.images,
              mappedThumbnailImg: mappedProduct.thumbnailImg,
              mappedImages: mappedProduct.images,
              hasImages: !!product.images,
              imagesLength: product.images?.length || 0
            })
          }

          return mappedProduct
        }) as FirebaseProduct[],
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

  // Get products with pagination and filters
  async getProducts(
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
  ): Promise<ProductListResponse> {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sortBy, sortOrder } = params

    const filters: any = {}

    // Apply filters
    if (category) {
      filters.field = 'category'
      filters.operator = '=='
      filters.value = category
    }

    if (minPrice !== undefined) {
      filters.field = 'regularPrice'
      filters.operator = '>='
      filters.value = minPrice
    }

    if (maxPrice !== undefined) {
      filters.field = 'regularPrice'
      filters.operator = '<='
      filters.value = maxPrice
    }

    // Get all products (Firestore doesn't have built-in pagination like SQL)
    const products = await this.query({
      ...filters,
      orderBy: sortBy || 'createdAt',
      orderDirection: sortOrder || 'desc',
    })

    // Apply search filter if provided
    let filteredProducts = products
    if (search) {
      filteredProducts = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase()) ||
          product.category?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Manual pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts.map((product) => ({
        ...product,
        id: product.id || '',
      })) as FirebaseProduct[],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1,
      },
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<FirebaseProduct | null> {
    try {
      const allProducts = await this.getAllProducts({ limit: 1000 }) // Get all products to search

      const product = allProducts.data.find(
        (p) => p.slug === slug || p.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase(),
      )

      return (product as FirebaseProduct) || null
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<FirebaseProduct | null> {
    const product = await this.getById(id)

    if (!product) return null

    return {
      ...product,
      id: product.id || '',
    } as FirebaseProduct
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

  // Search products
  async searchProducts(qr: string): Promise<FirebaseProduct[]> {
    try {
      const allProducts = await this.getAllProducts({ limit: 1000 })
      return allProducts.data.filter(
        (product) =>
          product.name?.toLowerCase().includes(qr.toLowerCase()) ||
          product.description?.toLowerCase().includes(qr.toLowerCase()) ||
          product.category?.toLowerCase().includes(qr.toLowerCase()),
      )
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }
}

export const productFirebaseService = new ProductFirebaseService()
