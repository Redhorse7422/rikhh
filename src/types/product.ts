// Product Detail Page Types
import type { Product } from './common'
import type { FileWithPreview } from '@/components/FormElements/UploadInput'

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
  id: string
  name: string
  regularPrice: number
  salePrice: number
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

export type ImageType = {
  id: string
  createdAt: string
  updatedAt: string
  scope: string
  uri: string | null
  url: string
  fileName: string
  mimetype: string
  size: number
  userId: string | null
}
export type CategoryType = {
  id: string
  createdAt: string
  updatedAt: string
  isParent: boolean
  parentId: string | null
  name: string
  slug: string
  description: string
  isActive: boolean
  thumbnailImageId: string
  coverImageId: string | null
  isFeatured: boolean
  isPopular: boolean
}

export type VariationType = {
  id?: string
  name: string
  variant: string
  sku: string
  price: string
  quantity: number
  imageId?: string
  image?: ImageType
  imageBase64?: FileWithPreview[]
}

export type SingleProduct = {
  id: string
  createdAt: string
  updatedAt: string
  addedBy: string
  userId: string
  name: string
  slug: string
  photosIds: string[]
  thumbnailImgId: string
  categoryIds: string[]
  tags: string[]
  shortDescription: string
  longDescription: string
  regularPrice: number
  salePrice: number
  isVariant: boolean
  published: boolean
  approved: boolean
  stock: number
  cashOnDelivery: boolean
  featured: boolean
  discount: number
  discountType: 'percent' | 'amount'
  discountStartDate: string | null
  discountEndDate: string | null
  tax: number
  taxType: 'percent' | 'amount'
  shippingType: 'free' | 'flat' | string
  shippingCost: number
  estShippingDays: number
  numOfSales: number
  metaTitle: string
  metaDescription: string
  rating: number
  externalLink: string
  externalLinkBtn: string
  categories: CategoryType[]
  thumbnailImg: ImageType
  photos: ImageType[]
  variations: VariationType[]
  discountEnabled?: boolean
}
