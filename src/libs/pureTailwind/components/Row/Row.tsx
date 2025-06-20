import type { TwUnionProp, TwGapAmount, TwAlignItems, TwWidth, TwHeight, TwJustifyContent } from '@/libs/pureTailwind'

import React, { useMemo } from 'react'

import {
  TW_CLS_GAP_SCREEN,
  generateTwScreenClassName,
  TW_CLS_ALIGN_ITEMS_SCREEN,
  TW_CLS_WIDTH_SCREEN,
  TW_CLS_HEIGHT_SCREEN,
  TW_CLS_JUSTIFY_CONTENT_SCREEN,
} from '@/libs/pureTailwind'

export type RowProps = {
  children: React.ReactNode
  gap?: TwUnionProp<TwGapAmount>
  rowGap?: TwUnionProp<TwGapAmount>
  colGap?: TwUnionProp<TwGapAmount>
  alignItems?: TwUnionProp<TwAlignItems>
  justifyContent?: TwUnionProp<TwJustifyContent>
  className?: string
  width?: TwUnionProp<Exclude<TwWidth, 'wide'>>
  height?: TwUnionProp<Exclude<TwHeight, 'wide'>>
  style?: React.CSSProperties
}

export const Row: React.FC<RowProps> = (props) => {
  const { className, children, width, height, gap, rowGap, colGap, alignItems, justifyContent, style } = props

  const generateClassName = useMemo(() => {
    return [
      'flex flex-row',
      className,
      width && generateTwScreenClassName(TW_CLS_WIDTH_SCREEN, width),
      height && generateTwScreenClassName(TW_CLS_HEIGHT_SCREEN, height),
      gap && generateTwScreenClassName(TW_CLS_GAP_SCREEN, gap),
      alignItems && generateTwScreenClassName(TW_CLS_ALIGN_ITEMS_SCREEN, alignItems),
      justifyContent && generateTwScreenClassName(TW_CLS_JUSTIFY_CONTENT_SCREEN, justifyContent),
    ]
      .join(' ')
      .replace(/  +/g, ' ')
  }, [width, height, gap, rowGap, colGap, className, alignItems, justifyContent])

  return (
    <div className={generateClassName} style={style}>
      {children}
    </div>
  )
}
