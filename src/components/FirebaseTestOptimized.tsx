'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { getSafeImageUrl, validateImageUrl } from '@/utils/image'

// Sample Firebase Storage URLs from the image description
const testUrls = [
  'https://firebasestorage.googleapis.com/v0/b/9d30a.firebasestorage.app/o/product_images/653736984595.jpg?alt=media&token=f632d7e1-9b38-47e5-88ba-6d6225ed39d6',
  'https://firebasestorage.googleapis.com/v0/b/9d30a.firebasestorage.app/o/product_images/2F1753724994595.jpg?alt=media&token=cce8ab40-292b-4601-b8c6-ecf05807a0e1',
  'https://firebasestorage.googleapis.com/v0/b/9d30a.firebasestorage.app/o/product_images/982173372482039.jpg?alt=media&token=940f-4588-b869-99acc60490a1',
]

export const FirebaseTestOptimized = () => {
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateUrls = async () => {
      const results: Record<string, boolean> = {}
      
      for (const url of testUrls) {
        try {
          console.log('🔍 Validating URL:', url)
          const isValid = await validateImageUrl(url)
          results[url] = isValid
          console.log(`✅ URL validation result: ${isValid ? 'SUCCESS' : 'FAILED'}`)
        } catch (error) {
          console.error('❌ Error validating URL:', url, error)
          results[url] = false
        }
      }
      
      setValidationResults(results)
      setLoading(false)
    }

    validateUrls()
  }, [])

  if (loading) {
    return (
      <div className='mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold'>Firebase Storage Image Test</h2>
        <div className='flex items-center space-x-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <span>Validating Firebase Storage URLs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto mt-8 max-w-4xl rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-bold'>Firebase Storage Image Test</h2>
      
      <div className='space-y-6'>
        {testUrls.map((url, index) => {
          const isValid = validationResults[url]
          const safeUrl = getSafeImageUrl(url)
          
          return (
            <div key={index} className='rounded-lg border p-4'>
              <div className='mb-2'>
                <h3 className='text-sm font-semibold'>Test Image {index + 1}</h3>
                <p className='text-xs text-gray-600 mb-2'>Status: {isValid ? '✅ Accessible' : '❌ Not Accessible'}</p>
                <p className='text-xs text-gray-600 break-all'>{url}</p>
              </div>
              
              <div className='h-32 w-32 rounded overflow-hidden border'>
                <Image
                  src={safeUrl}
                  alt={`Test image ${index + 1}`}
                  width={128}
                  height={128}
                  className='h-full w-full object-cover'
                  onError={() => console.error('❌ Image failed to load:', url)}
                  onLoad={() => console.log('✅ Image loaded successfully:', url)}
                  unoptimized={true}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='text-sm font-semibold mb-2'>Troubleshooting Tips:</h3>
        <ul className='text-xs text-gray-600 space-y-1'>
          <li>• Check if Firebase Storage rules allow public read access</li>
          <li>• Verify that the storage bucket is properly configured</li>
          <li>• Ensure CORS is enabled for your domain</li>
          <li>• Check if the image files actually exist in Firebase Storage</li>
        </ul>
      </div>
    </div>
  )
}
