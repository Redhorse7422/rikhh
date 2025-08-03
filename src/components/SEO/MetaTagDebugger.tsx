'use client'

import { useEffect } from 'react'

interface MetaTagDebuggerProps {
  product?: any
}

export const MetaTagDebugger: React.FC<MetaTagDebuggerProps> = ({ product }) => {
  useEffect(() => {
    // This component helps debug meta tags
    // You can temporarily add this to any page to see the current meta tags
    if (typeof window !== 'undefined') {
      console.log('=== Meta Tags Debug Info ===')

      // Log all meta tags
      const metaTags = document.querySelectorAll('meta')
      metaTags.forEach((tag, index) => {
        const name = tag.getAttribute('name') || tag.getAttribute('property')
        const content = tag.getAttribute('content')
        if (name && content) {
          console.log(`${index + 1}. ${name}: ${content}`)
        }
      })

      // Log Open Graph tags specifically
      const ogTags = document.querySelectorAll('meta[property^="og:"]')
      console.log('=== Open Graph Tags ===')
      ogTags.forEach((tag) => {
        const property = tag.getAttribute('property')
        const content = tag.getAttribute('content')
        console.log(`${property}: ${content}`)
      })

      // Log Twitter Card tags
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]')
      console.log('=== Twitter Card Tags ===')
      twitterTags.forEach((tag) => {
        const name = tag.getAttribute('name')
        const content = tag.getAttribute('content')
        console.log(`${name}: ${content}`)
      })

      if (product) {
        console.log('=== Product Info ===')
        console.log('Product Name:', product.name)
        console.log('Product Description:', product.description)
        console.log('Product Image:', product.thumbnailImg || product.images?.[0])
        console.log('Product URL:', window.location.href)
      }
    }
  }, [product])

  // This component doesn't render anything visible
  return null
}
