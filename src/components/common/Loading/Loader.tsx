'use client'

import React from 'react'

import clsx from 'clsx'

type LoaderProps = {
  size?: number
  className?: string
  color?: string
  label?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 32,
  className,
  color = 'text-primary',
  label = 'Loading...',
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2', className)}>
      <svg className={clsx('animate-spin', color)} width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
      </svg>

      {label && <p className='text-sm text-gray-500'>{label}</p>}
    </div>
  )
}
