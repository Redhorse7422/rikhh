import type {
  TwAlignSelf,
  TwGridColSpanAmount,
  TwGridColStartAmount,
  TwGridRowSpanAmount,
  TwGridRowStartAmount,
  TwJustifySelf,
  TwUnionProp,
} from '@/libs/pureTailwind'

import React, { useMemo } from 'react'

import clsx from 'clsx'

import {
  generateTwScreenClassName,
  TW_CLS_ALIGN_SELF_SCREEN,
  TW_CLS_GRID_COL_SPAN_SCREEN,
  TW_CLS_GRID_COL_START_SCREEN,
  TW_CLS_GRID_COL_END_SCREEN,
  TW_CLS_GRID_ROW_SPAN_SCREEN,
  TW_CLS_GRID_ROW_START_SCREEN,
  TW_CLS_GRID_ROW_END_SCREEN,
  TW_CLS_JUSTIFY_SELF_SCREEN,
} from '@/libs/pureTailwind'

export type GridItemProps = {
  children: React.ReactNode
  colSpan?: TwUnionProp<TwGridColSpanAmount>
  colStart?: TwUnionProp<TwGridColStartAmount>
  colEnd?: TwUnionProp<TwGridColStartAmount>
  rowSpan?: TwUnionProp<TwGridRowSpanAmount>
  rowStart?: TwUnionProp<TwGridRowStartAmount>
  rowEnd?: TwUnionProp<TwGridRowStartAmount>
  alignSelf?: TwUnionProp<TwAlignSelf>
  justifySelf?: TwUnionProp<TwJustifySelf>
  fullWidth?: boolean
  className?: string
  style?: React.CSSProperties
}

export const GridItem: React.FC<GridItemProps> = (props) => {
  const {
    className,
    children,
    colSpan,
    colStart,
    colEnd,
    rowSpan,
    rowStart,
    rowEnd,
    alignSelf,
    justifySelf,
    fullWidth,
    style,
  } = props

  const generateClassName = useMemo(() => {
    return clsx(
      className,
      fullWidth && 'w-full',
      colSpan && generateTwScreenClassName(TW_CLS_GRID_COL_SPAN_SCREEN, colSpan),
      colStart && generateTwScreenClassName(TW_CLS_GRID_COL_START_SCREEN, colStart),
      colEnd && generateTwScreenClassName(TW_CLS_GRID_COL_END_SCREEN, colEnd),
      rowSpan && generateTwScreenClassName(TW_CLS_GRID_ROW_SPAN_SCREEN, rowSpan),
      rowStart && generateTwScreenClassName(TW_CLS_GRID_ROW_START_SCREEN, rowStart),
      rowEnd && generateTwScreenClassName(TW_CLS_GRID_ROW_END_SCREEN, rowEnd),
      alignSelf && generateTwScreenClassName(TW_CLS_ALIGN_SELF_SCREEN, alignSelf),
      justifySelf && generateTwScreenClassName(TW_CLS_JUSTIFY_SELF_SCREEN, justifySelf),
    )
  }, [colSpan, colStart, colEnd, rowSpan, rowStart, rowEnd, alignSelf, justifySelf, fullWidth])

  return (
    <div className={generateClassName} style={style}>
      {children}
    </div>
  )
}
