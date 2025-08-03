'use client'

import React, { useState, useRef } from 'react'

import Image from 'next/image'

interface ImageMagnifierProps {
  src: string
  alt: string
  width: number
  height: number
  magnifierSize?: number
  zoomLevel?: number
  className?: string
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  width,
  height,
  magnifierSize = 150,
  zoomLevel = 2.5,
  className = '',
}) => {
  const [isMagnifying, setIsMagnifying] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current || !isMagnifying) return

    const imageRect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - imageRect.left) / imageRect.width) * 100
    const y = ((e.clientY - imageRect.top) / imageRect.height) * 100

    setMagnifierPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} onMouseMove={handleMouseMove} style={{ width, height }}>
      {/* Main image */}
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className='block h-full w-full object-cover'
        onLoad={() => setImageLoaded(true)}
      />

      {/* Magnifier */}
      {isMagnifying && imageLoaded && (
        <div
          className='pointer-events-none absolute z-10 overflow-hidden rounded-full border-2 border-white shadow-lg'
          style={{
            width: magnifierSize,
            height: magnifierSize,
            left: `calc(${magnifierPosition.x}% - ${magnifierSize / 2}px)`,
            top: `calc(${magnifierPosition.y}% - ${magnifierSize / 2}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className='h-full w-full'
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,
              backgroundPosition: `-${(magnifierPosition.x / 100) * (width * zoomLevel - magnifierSize)}px -${
                (magnifierPosition.y / 100) * (height * zoomLevel - magnifierSize)
              }px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      )}

      {/* Loader */}
      {!imageLoaded && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-gray-100'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
        </div>
      )}

      {/* Zoom icon trigger */}
      <button
        type='button'
        onClick={() => setIsMagnifying(!isMagnifying)}
        className='absolute bottom-4 right-4 z-20 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm'
      >
        🔍
      </button>
    </div>
  )
}
