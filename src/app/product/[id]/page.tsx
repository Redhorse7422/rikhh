import type { Metadata } from 'next'

import { ProductDetailPage } from '@/components/Pages/Buyer/ProductDetailPage'
import { ProductStructuredData } from '@/components/SEO/ProductStructuredData'

import { fetchProductById } from './utils'

// Generate metadata for the product page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const product = await fetchProductById(resolvedParams.id)

  if (!product) {
    return {
      title: 'Product Not Found | Rikhh',
      description: 'The product you are looking for does not exist.',
    }
  }

  const productTitle = `${product.name} | Rikhh`
  const productDescription = product.description || `Check out ${product.name} on Rikhh. Best prices and quality guaranteed.`
  const productImage = product.thumbnailImg || product.images?.[0] || '/images/no-image.png'
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rikhh.com'}/product/${product.id}`
  const productPrice = product.salePrice || product.regularPrice

  return {
    title: productTitle,
    description: productDescription,
    keywords: product.tags?.join(', ') || product.category || 'product, shopping, online store',
    
    // Open Graph meta tags for Facebook, WhatsApp, etc.
    openGraph: {
      title: productTitle,
      description: productDescription,
      type: 'website',
      url: productUrl,
      siteName: 'Rikhh',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    
    // Twitter Card meta tags
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription,
      images: [productImage],
      creator: '@rikhh',
      site: '@rikhh',
    },
    
    // Additional meta tags for better sharing
    alternates: {
      canonical: productUrl,
    },
    
    // Structured data for rich snippets
    other: {
      'product:price:amount': productPrice.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
    },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const product = await fetchProductById(resolvedParams.id)

  if (!product) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Product Not Found</h1>
          <p className='text-gray-600'>The product you&apos;re looking for doesn&apos;t exist.</p>
          <p className='mt-2 text-sm text-gray-500'>ID: {resolvedParams.id}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ProductStructuredData product={product} />
      <ProductDetailPage product={product} isLoading={false} />
    </>
  )
}
