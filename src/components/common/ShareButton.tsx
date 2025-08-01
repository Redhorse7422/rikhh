'use client'

import React, { useState } from 'react'

import { Icon } from '@/components/common/icon'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  image?: string
  className?: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title, description, image, className = '' }) => {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareData = {
    title,
    text: description || title,
    url,
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShowShareMenu(false)
      } else {
        setShowShareMenu(!showShareMenu)
      }
    } catch (error) {
      console.error('Error sharing:', error)
      setShowShareMenu(!showShareMenu)
    }
  }

  const handleSocialShare = (platform: string) => {
    let shareUrl = ''

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // You can add a toast notification here
        setShowShareMenu(false)
        return
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200'
      >
        <Icon name='AiOutlineUpload' className='h-4 w-4' />
        <span>Share</span>
      </button>

      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-40' onClick={() => setShowShareMenu(false)} />

          {/* Share Menu */}
          <div className='absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg'>
            <div className='space-y-1'>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'
              >
                <span className='text-green-500'>📱</span>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleSocialShare('facebook')}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600'
              >
                <Icon name='FaFacebookF' className='h-4 w-4 text-blue-500' />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleSocialShare('twitter')}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-400'
              >
                <Icon name='FaTwitter' className='h-4 w-4 text-blue-400' />
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleSocialShare('telegram')}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-500'
              >
                <span className='text-blue-500'>📬</span>
                <span>Telegram</span>
              </button>

              <hr className='my-1' />

              <button
                onClick={() => handleSocialShare('copy')}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50'
              >
                <Icon name='AiOutlineFileText' className='h-4 w-4' />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
