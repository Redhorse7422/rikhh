'use client'

import React from 'react'

import clsx from 'clsx'

export type FlexProps = {
  children: React.ReactNode
  vertical?: boolean
  wrap?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  gap?: 'small' | 'middle' | 'large'
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}

export const Flex: React.FC<FlexProps> = ({
  children,
  vertical = false,
  wrap = false,
  className,
  style,
  onClick,
  gap = 'small',
  justify = 'start',
  align = 'center',
}) => {
  const gapMap = {
    small: 'gap-2',
    middle: 'gap-4',
    large: 'gap-6',
  }

  const justifyMap: Record<NonNullable<FlexProps['justify']>, string> = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    'space-around': 'justify-around',
    'space-between': 'justify-between',
    'space-evenly': 'justify-evenly',
  }

  const alignMap: Record<NonNullable<FlexProps['align']>, string> = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  }

  return (
    <div
      className={clsx(
        'flex',
        vertical && 'flex-col',
        wrap && 'flex-wrap',
        gapMap[gap],
        justifyMap[justify],
        alignMap[align],
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
