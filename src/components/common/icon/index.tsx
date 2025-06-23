'use client'

import type { TwColorSemantic } from '@/libs/pureTailwind'
import type { TextSize } from '@/types/text'

import React from 'react'

import clsx from 'clsx'

import { handleTwColor } from '@/libs/pureTailwind'

import { ReactIcon } from './ReactIcon'

// NOTE: Add icon to this object
export const ICON_ALLOWED = {
  ...ReactIcon,
}

// NOTE: Prepare className for Tailwind JIT mode
// text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl text-8xl
// !text-xs !text-sm !text-base !text-lg !text-xl !text-2xl !text-3xl !text-4xl !text-5xl !text-6xl !text-7xl !text-8xl

export type IconAllowed = keyof typeof ICON_ALLOWED

export type IconProps = {
  id?: string
  name: IconAllowed
  size?: TextSize
  color?: TwColorSemantic
  strokeColor?: TwColorSemantic
  fillColor?: TwColorSemantic
  className?: string
  classNameWrapper?: string
  style?: React.CSSProperties
  onClick?: () => void
  noWrapper?: boolean
}

export const Icon: React.FC<IconProps> = ({
  id,
  name,
  size = 'md',
  color = 'default',
  fillColor,
  strokeColor,
  className,
  classNameWrapper,
  style,
  onClick,
  noWrapper,
}) => {
  const IconComponent = ICON_ALLOWED[name]

  const getWidthAndHeight = () => {
    switch (size) {
      case 'xs':
        return { width: 12, height: 12 }
      case 'sm':
        return { width: 14, height: 14 }
      case 'lg':
        return { width: 18, height: 18 }
      case 'xl':
        return { width: 20, height: 20 }
      case '2xl':
        return { width: 24, height: 24 }
      case '3xl':
        return { width: 30, height: 30 }
      case '4xl':
        return { width: 36, height: 36 }
      case '5xl':
        return { width: 48, height: 48 }
      case '6xl':
        return { width: 60, height: 60 }
      case '7xl':
        return { width: 72, height: 72 }
      case '8xl':
        return { width: 96, height: 96 }
      case '9xl':
        return { width: 120, height: 120 }
      case 'md':
      default:
        return { width: 16, height: 16 }
    }
  }

  const renderer = (
    <IconComponent
      {...getWidthAndHeight()}
      style={style}
      className={clsx(
        className,
        `!text-${size === 'md' ? 'base' : size}`,
        color && handleTwColor(color),
        strokeColor && handleTwColor(strokeColor, 'stroke'),
        (strokeColor || fillColor) && handleTwColor(fillColor || strokeColor || 'default', 'fill'),
      )}
    />
  )

  if (noWrapper) return renderer

  return (
    <div id={id} className={clsx('flex items-center justify-center', classNameWrapper)} onClick={onClick}>
      {renderer}
    </div>
  )
}
