'use client'

import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

interface ProductStructuredDataProps {
  product: FirebaseProduct
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'

  // Ensure image URL is absolute and use proxy for Firebase Storage images
  let productImage = product.thumbnailImg || product.images?.[0]
  if (productImage && !productImage.startsWith('http')) {
    productImage = `${baseUrl}${productImage}`
  } else if (productImage && productImage.includes('firebasestorage.googleapis.com')) {
    // Use image proxy for Firebase Storage images to ensure WhatsApp compatibility
    const encodedUrl = encodeURIComponent(productImage)
    productImage = `${baseUrl}/api/image-proxy?url=${encodedUrl}`
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImage,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Rikhh',
    },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.regularPrice,
      priceCurrency: 'INR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/product/${product.id}`,
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviews || 0,
        }
      : undefined,
    category: product.category,
    ...(product.weight && { weight: product.weight }),
    ...(product.dimensions && {
      height: product.dimensions.height,
      width: product.dimensions.width,
      depth: product.dimensions.length,
    }),
  }

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
