'use client'

import type { FirebaseProduct } from '@/components/Pages/Buyer/ProductDetailPage'

interface ProductStructuredDataProps {
  product: FirebaseProduct
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.thumbnailImg || product.images?.[0],
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/product/${product.id}`,
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
