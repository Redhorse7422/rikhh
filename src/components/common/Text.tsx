'use client'

import React, { forwardRef } from 'react'

import clsx from 'clsx'

type TextProps = {
  id?: string
  children?: React.ReactNode
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'a'
  href?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  color?: string
  decoration?: 'underline' | 'italic' | 'strong' | 'delete' | 'mark' | 'code' | 'kbd' | 'disabled'
  ellipsis?: boolean
  noWrap?: boolean
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
  copyable?: boolean
}

export const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    id,
    as: Component = 'span',
    children,
    href,
    size = 'base',
    weight = 'normal',
    color = 'text-gray-900',
    decoration,
    ellipsis,
    noWrap,
    className,
    onClick,
    style,
    copyable,
  } = props

  const baseClasses = clsx(
    `text-${size}`,
    `font-${weight}`,
    color,
    decoration === 'underline' && 'underline',
    decoration === 'italic' && 'italic',
    decoration === 'strong' && 'font-bold',
    decoration === 'delete' && 'line-through',
    decoration === 'mark' && 'bg-yellow-200',
    decoration === 'code' && 'font-mono text-sm bg-gray-100 px-1 py-0.5 rounded',
    decoration === 'kbd' && 'font-mono text-sm border px-1 rounded',
    decoration === 'disabled' && 'opacity-50 cursor-not-allowed',
    noWrap && 'whitespace-nowrap',
    ellipsis && 'truncate',
    className,
  )

  const content = copyable ? (
    <span
      className='cursor-pointer'
      onClick={() => navigator.clipboard.writeText(String(children))}
      title='Click to copy'
    >
      {children}
    </span>
  ) : (
    children
  )

  if (Component === 'a') {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        id={id}
        href={href}
        className={baseClasses}
        onClick={onClick}
        style={style}
      >
        {content}
      </a>
    )
  }

  return (
    <Component id={id} className={baseClasses} onClick={onClick} style={style}>
      {content}
    </Component>
  )
})

Text.displayName = 'Text'
