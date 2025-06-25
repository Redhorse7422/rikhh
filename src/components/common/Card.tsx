'use client'

import React from 'react'

import clsx from 'clsx'

export type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  bordered?: boolean
  rounded?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  bordered = true,
  rounded = true,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  return (
    <div
      className={clsx(
        'bg-white',
        paddingClasses[padding],
        shadowClasses[shadow],
        {
          border: bordered,
          'rounded-lg': rounded,
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
