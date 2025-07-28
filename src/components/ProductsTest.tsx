'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { productFirebaseService } from '@/services/firebase/products.firebase'
import { getSafeImageUrl, isFirebaseStorageUrl } from '@/utils/image'

export const ProductsTest = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🧪 Testing product fetching...')
        const result = await productFirebaseService.getAllProducts({ limit: 8 })
        console.log('✅ Products fetched successfully:', result)
        
        // Log detailed product information
        if (result.data && result.data.length > 0) {
          console.log('📊 First product details:', {
            id: result.data[0].id,
            name: result.data[0].name,
            thumbnailImg: result.data[0].thumbnailImg,
            images: result.data[0].images,
            hasImages: !!result.data[0].images,
            imagesLength: result.data[0].images?.length || 0,
            thumbnailType: typeof result.data[0].thumbnailImg,
            imagesType: typeof result.data[0].images
          })
        }
        
        setProducts(result.data || [])
      } catch (err) {
        console.error('❌ Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleImageError = (productId: string) => {
    console.error('❌ Image failed to load for product:', productId)
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const handleImageLoad = (productId: string, imageUrl: string) => {
    console.log('✅ Image loaded successfully for product:', productId, imageUrl)
  }

  if (loading) {
    return (
      <div className='mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold'>Products Test</h2>
        <div className='flex items-center space-x-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <span>Loading products...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold'>Products Test</h2>
        <div className='text-red-600'>
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-bold'>Products Test</h2>
      <div className='mb-4'>
        <p className='text-green-600'>✅ Found {products.length} products</p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {products.map((product) => {
          const hasImageError = imageErrors[product.id]
          const thumbnail = hasImageError 
            ? '/images/no-image.png'
            : getSafeImageUrl(product.thumbnailImg)

          return (
            <div key={product.id} className='rounded-lg border p-4'>
              <h3 className='mb-2 text-sm font-semibold'>{product.name}</h3>
              <p className='mb-2 text-xs text-gray-600'>ID: {product.id}</p>
              <p className='mb-2 text-xs text-gray-600'>Price: ${product.regularPrice}</p>
              <p className='mb-2 text-xs text-gray-600'>Category: {product.category}</p>
              <p className='mb-2 text-xs text-gray-600'>Thumbnail: {product.thumbnailImg || 'No thumbnail'}</p>
              <p className='mb-2 text-xs text-gray-600'>Images count: {product.images?.length || 0}</p>
              <div className='mb-2 h-32 w-full rounded overflow-hidden'>
                <Image
                  src={thumbnail}
                  alt={product.name}
                  width={300}
                  height={300}
                  className='h-full w-full object-cover'
                  onError={() => handleImageError(product.id)}
                  onLoad={() => handleImageLoad(product.id, product.thumbnailImg)}
                  unoptimized={isFirebaseStorageUrl(thumbnail)}
                />
              </div>
              <Link
                href={`/product/${product.slug || product.id}`}
                className='block w-full rounded bg-blue-500 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-blue-600'
              >
                View Details
              </Link>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className='py-8 text-center'>
          <p className='text-gray-600'>No products found</p>
        </div>
      )}
    </div>
  )
}
