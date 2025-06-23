'use client'

import type { TextDecoration, TextSize, TextWeight } from '@/types/text'

import type { FC } from 'react'

import clsx from 'clsx'

import { handleTwColor, type TwColorSemantic } from '@/libs/pureTailwind'

import {
  dateStatus,
  toDateBase,
  toDateLong,
  toDateShort,
  toDateTimeBase,
  toDateTimeLong,
  toDateTimeNoSecBase,
  toDateTimeShort,
  toTimeBase,
  toTimeShortBase,
} from './DateTime'
import { NumericText } from './NumericText'
import { Icon } from '../icon'

export type ValueType =
  | 'text'
  | 'number' // NOTE: 1000
  | 'number-digit' // NOTE: 1000.00
  | 'number-short' // NOTE: 1k
  | 'number-short-digit' // NOTE: 1.02k
  | 'price' // NOTE: 1,000
  | 'price-digit' // NOTE: 1,000.00
  | 'price-short' // NOTE: 1k
  | 'price-short-digit' // NOTE: 1.02k
  | 'currency' // NOTE: ฿1,000
  | 'currency-digit' // NOTE: ฿1,000.00
  | 'currency-short' // NOTE: ฿1k
  | 'currency-short-digit' // NOTE: ฿1.02k
  | 'percent' // NOTE: 100%
  | 'percent-digit' // NOTE: 100.00%
  | 'percent-short' // NOTE: 1k%
  | 'percent-short-digit' // NOTE: 1.02k%
  | 'date' // NOTE: 31/12/2024
  | 'date-time' // NOTE: 31/12/2024 23:59:59
  | 'date-time-no-sec' // NOTE: 31/12/2024 23:59
  | 'time' // NOTE: 23:59:59
  | 'time-short' // NOTE: 23:59
  | 'date-long' // NOTE: 31 December 2024
  | 'date-time-long' // NOTE: 31 December 2024 23:59:59
  | 'date-short' // NOTE: 31 Dec 2024
  | 'date-time-short' // NOTE: 31 Dec 2024 23:59:59
  | 'date-status' // NOTE: ongoing, within_1_month, within_1_week, upcoming, today, ended
  | 'boolean-icon' // NOTE: true: check, false: x

type ValueProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  defaultValue?: string | number | boolean | Date
  type?: ValueType
  className?: string
  color?: TwColorSemantic
  size?: TextSize
  weight?: TextWeight
  decoration?: TextDecoration
  noWrap?: boolean
  prefix?: string
}

// NOTE: Prepare tw class on JIT mode
// ! text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl text-8xl
// ! font-thin font-extralight font-light font-normal font-medium font-semibold font-bold font-extrabold font-black

export const RenderValue: FC<ValueProps> = ({
  value,
  type = 'text',
  prefix = '฿',
  className,
  color,
  size = 'md',
  weight,
  noWrap,
  decoration,
}) => {
  const mergedClassName = clsx(
    color && handleTwColor(color),
    size && `text-${size === 'md' ? 'base' : size}`,
    weight && `font-${weight}`,
    noWrap && 'whitespace-nowrap',
    className,
    decoration && decoration,
  )

  const numberTypes = [
    'number',
    'number-digit',
    'number-short',
    'number-short-digit',
    'price',
    'price-digit',
    'price-short',
    'price-short-digit',
    'currency',
    'currency-digit',
    'currency-short',
    'currency-short-digit',
    'percent',
    'percent-digit',
    'percent-short',
    'percent-short-digit',
  ]

  const dateTypes = [
    'date',
    'date-time',
    'date-time-no-sec',
    'time',
    'time-short',
    'date-long',
    'date-time-long',
    'date-short',
    'date-time-short',
  ]

  if (numberTypes.includes(type)) {
    switch (type) {
      case 'number':
        return <NumericText value={value} className={mergedClassName} prefix={prefix} />
      case 'number-digit':
        return (
          <NumericText value={value} decimalScale={2} fixedDecimalScale className={mergedClassName} prefix={prefix} />
        )
      case 'number-short':
        return <NumericText value={value} short className={mergedClassName} prefix={prefix} />
      case 'number-short-digit':
        return <NumericText value={value} short decimalScale={2} className={mergedClassName} prefix={prefix} />
      case 'price':
        return <NumericText value={value} thousandSeparator className={mergedClassName} prefix={prefix} />
      case 'price-digit':
        return (
          <NumericText
            value={value}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            className={mergedClassName}
            prefix={prefix}
          />
        )
      case 'price-short':
        return <NumericText value={value} short className={mergedClassName} prefix={prefix} />
      case 'price-short-digit':
        return <NumericText value={value} short decimalScale={2} className={mergedClassName} prefix={prefix} />
      case 'currency':
        return <NumericText value={value} thousandSeparator className={mergedClassName} prefix={prefix} />
      case 'currency-digit':
        return (
          <NumericText
            value={value}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            className={mergedClassName}
            prefix={prefix}
          />
        )
      case 'currency-short':
        return <NumericText value={value} short className={mergedClassName} prefix={prefix} />
      case 'currency-short-digit':
        return <NumericText value={value} short decimalScale={2} className={mergedClassName} prefix={prefix} />
      case 'percent':
        return <NumericText value={value} thousandSeparator suffix='%' className={mergedClassName} prefix={prefix} />
      case 'percent-digit':
        return (
          <NumericText
            value={value}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            suffix='%'
            className={mergedClassName}
            prefix={prefix}
          />
        )
      case 'percent-short':
        return <NumericText value={value} short suffix='%' className={mergedClassName} prefix={prefix} />
      case 'percent-short-digit':
        return (
          <NumericText value={value} short decimalScale={2} suffix='%' className={mergedClassName} prefix={prefix} />
        )
    }
  }

  if (dateTypes.includes(type)) {
    if (!value) return <span className={mergedClassName}>-</span>

    switch (type) {
      case 'date':
        return <span className={mergedClassName}>{toDateBase(value)}</span>
      case 'date-time':
        return <span className={mergedClassName}>{toDateTimeBase(value)}</span>
      case 'date-time-no-sec':
        return <span className={mergedClassName}>{toDateTimeNoSecBase(value)}</span>
      case 'time':
        return <span className={mergedClassName}>{toTimeBase(value)}</span>
      case 'time-short':
        return <span className={mergedClassName}>{toTimeShortBase(value)}</span>
      case 'date-long':
        return <span className={mergedClassName}>{toDateLong(value)}</span>
      case 'date-time-long':
        return <span className={mergedClassName}>{toDateTimeLong(value)}</span>
      case 'date-short':
        return <span className={mergedClassName}>{toDateShort(value)}</span>
      case 'date-time-short':
        return <span className={mergedClassName}>{toDateTimeShort(value)}</span>
      case 'date-status':
        return <span className={mergedClassName}>{dateStatus(value)}</span>
    }
  }

  switch (type) {
    case 'boolean-icon':
      return (
        <span className={mergedClassName}>
          <Icon name={value ? 'AiOutlineCheck' : 'AiOutlineClose'} color={value ? 'success' : 'danger'} size={size} />
        </span>
      )
    default:
      return <span className={mergedClassName}>{value}</span>
  }
}
