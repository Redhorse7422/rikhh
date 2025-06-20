import type {
  TwUnionProp,
  TwGridColAmount,
  TwGapAmount,
  TwGridRowAmount,
  TwAlignItems,
  TwAlignSelf,
  TwJustifyItems,
  TwWidth,
  TwHeight,
} from '@/libs/pureTailwind'

import React, { useMemo } from 'react'

import clsx from 'clsx'

import {
  TW_CLS_GRID_COL_SCREEN,
  TW_CLS_GRID_ROW_SCREEN,
  TW_CLS_GAP_SCREEN,
  TW_CLS_GRID_ROW_GAP_SCREEN,
  TW_CLS_GRID_COL_GAP_SCREEN,
  generateTwScreenClassName,
  TW_CLS_ALIGN_ITEMS_SCREEN,
  TW_CLS_ALIGN_SELF_SCREEN,
  TW_CLS_JUSTIFY_ITEMS_SCREEN,
  TW_CLS_WIDTH_SCREEN,
  TW_CLS_HEIGHT_SCREEN,
} from '@/libs/pureTailwind'

export type GridProps = {
  children: React.ReactNode
  col?: TwUnionProp<TwGridColAmount>
  row?: TwUnionProp<TwGridRowAmount>
  gap?: TwUnionProp<TwGapAmount>
  rowGap?: TwUnionProp<TwGapAmount>
  colGap?: TwUnionProp<TwGapAmount>
  alignItems?: TwUnionProp<TwAlignItems>
  alignSelf?: TwUnionProp<TwAlignSelf>
  justifyItems?: TwUnionProp<TwJustifyItems>
  className?: string
  width?: TwUnionProp<Exclude<TwWidth, 'wide'>>
  height?: TwUnionProp<Exclude<TwHeight, 'wide'>>
  style?: React.CSSProperties
}

export const Grid: React.FC<GridProps> = (props) => {
  const {
    className,
    children,
    width,
    height,
    col,
    row,
    gap,
    rowGap,
    colGap,
    alignItems,
    alignSelf,
    justifyItems,
    style,
  } = props

  const generateClassName = useMemo(() => {
    return clsx(
      'grid',
      className,
      width && generateTwScreenClassName(TW_CLS_WIDTH_SCREEN, width),
      height && generateTwScreenClassName(TW_CLS_HEIGHT_SCREEN, height),
      col && generateTwScreenClassName(TW_CLS_GRID_COL_SCREEN, col),
      row && generateTwScreenClassName(TW_CLS_GRID_ROW_SCREEN, row),
      gap && generateTwScreenClassName(TW_CLS_GAP_SCREEN, gap),
      rowGap && generateTwScreenClassName(TW_CLS_GRID_ROW_GAP_SCREEN, rowGap),
      colGap && generateTwScreenClassName(TW_CLS_GRID_COL_GAP_SCREEN, colGap),
      alignItems && generateTwScreenClassName(TW_CLS_ALIGN_ITEMS_SCREEN, alignItems),
      alignSelf && generateTwScreenClassName(TW_CLS_ALIGN_SELF_SCREEN, alignSelf),
      justifyItems && generateTwScreenClassName(TW_CLS_JUSTIFY_ITEMS_SCREEN, justifyItems),
    )
  }, [width, height, col, row, gap, rowGap, colGap, className, alignItems, alignSelf, justifyItems])

  return (
    <div className={generateClassName} style={style}>
      {children}
    </div>
  )
}
