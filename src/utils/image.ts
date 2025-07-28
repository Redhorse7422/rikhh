/**
 * Image utility functions for handling Firebase Storage URLs and fallbacks
 */

/**
 * Check if a URL is a Firebase Storage URL
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  return url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')
}

/**
 * Get a safe image URL with fallback
 */
export const getSafeImageUrl = (url: string | null | undefined, fallback: string = '/images/no-image.png'): string => {
  if (!url || url.trim() === '') {
    return fallback
  }

  // If it's already a fallback URL, return as is
  if (url === fallback) {
    return url
  }

  // For Firebase Storage URLs, ensure they have proper format
  if (isFirebaseStorageUrl(url)) {
    // Check if the URL has the required parameters
    if (!url.includes('alt=media')) {
      // Try to add the alt=media parameter if missing
      const separator = url.includes('?') ? '&' : '?'
      url = `${url}${separator}alt=media`
    }

    // Add timestamp to prevent caching issues
    const timestamp = Date.now()
    const separator = url.includes('?') ? '&' : '?'
    url = `${url}${separator}t=${timestamp}`
  }

  return url
}

/**
 * Validate if an image URL is accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    // For Firebase Storage URLs, we'll use a different approach
    if (isFirebaseStorageUrl(url)) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = getSafeImageUrl(url)
        // Set a timeout to prevent hanging
        setTimeout(() => resolve(false), 5000)
      })
    }

    // For other URLs, use HEAD request
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
    })
    return response.ok
  } catch (error) {
    console.error('Image validation failed:', error)
    return false
  }
}

/**
 * Get optimized image URL for Next.js Image component
 */
export const getOptimizedImageUrl = (url: string, width: number = 300, height: number = 300): string => {
  if (isFirebaseStorageUrl(url)) {
    // For Firebase Storage URLs, we might need to use unoptimized mode
    // or add specific parameters for optimization
    return url
  }

  // For other URLs, return as is (Next.js will handle optimization)
  return url
}

/**
 * Create a proxy URL for Firebase Storage images to avoid CORS issues
 */
export const getProxyImageUrl = (url: string): string => {
  if (isFirebaseStorageUrl(url)) {
    // You can implement a proxy API route here if needed
    // For now, return the original URL
    return url
  }
  return url
}
