// Product Detail Page Types
import type { Product } from './common'

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  inStock: boolean
  sku?: string
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  createdAt: Date
  helpful: number
  verified: boolean
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
}

export interface ProductDetail extends Product {
  // Extended from base Product type
  id: number
  name: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image: string
  badge?: string
  description?: string
  category?: string
  tags?: string[]
  inStock?: boolean
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }

  // Additional detail page properties
  longDescription: string
  shortDescription: string
  brand: string
  model: string
  warranty: string
  returnPolicy: string
  shippingInfo: string
  images: ProductImage[]
  variants: ProductVariant[]
  specifications: ProductSpecification[]
  productReviews: ProductReview[]
  relatedProducts: Product[]
  inWishlist: boolean
  stockQuantity: number
  minOrderQuantity: number
  maxOrderQuantity: number
  isOnSale: boolean
  saleEndDate?: Date
  discountPercentage?: number
  shippingWeight: number
  packageDimensions: {
    length: number
    width: number
    height: number
  }
  features: string[]
  materials: string[]
  colors: string[]
  sizes: string[]
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order'
}

export interface ProductDetailPageProps {
  product?: ProductDetail
  isLoading?: boolean
}

export interface ProductGalleryProps {
  images: ProductImage[]
  mainImage: ProductImage
  onImageChange: (image: ProductImage) => void
}

export interface ProductInfoProps {
  product: ProductDetail
  selectedQuantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onAddToWishlist: () => void
  onShare: () => void
}

export interface ProductReviewsProps {
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
  onLoadMore: () => void
  hasMore: boolean
}

export interface ProductSpecificationsProps {
  specifications: ProductSpecification[]
}

export interface RelatedProductsProps {
  products: Product[]
}

export interface ProductTabsProps {
  product: ProductDetail
  activeTab: string
  onTabChange: (tab: string) => void
}
