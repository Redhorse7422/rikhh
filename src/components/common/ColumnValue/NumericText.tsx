'use client'

import type { NumericFormatProps } from 'react-number-format'

import type { FC } from 'react'

import { NumberFormatBase, useNumericFormat } from 'react-number-format'

type NumericTextProps = {
  short?: boolean
} & NumericFormatProps

export const NumericText: FC<NumericTextProps> = (props) => {
  const { value, short, decimalScale, prefix = '', suffix = '', className } = props
  const { format } = useNumericFormat(props)

  const prefixPostFix = (val: string) => `${prefix}${val}${suffix}`

  if (value === '-') return prefixPostFix(value)

  const shortFormatter = (v?: number) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ]

    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
    const item = lookup.findLast((it) => Number(v) >= it.value)
    const result = item ? (Number(v) / item.value).toFixed(decimalScale).replace(regexp, '').concat(item.symbol) : '0'

    return result
  }

  const _format = (val: string) => {
    const _val = format?.(val) || ''
    const newVal = _val.replace(prefix, '').replace(suffix, '')

    if (short) return prefixPostFix(shortFormatter(Number(newVal)))

    return _val
  }

  return <NumberFormatBase value={Number(value)} format={_format} displayType='text' className={className} />
}
