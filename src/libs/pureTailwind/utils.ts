import type { TwColorSemantic, TwScreenStyle } from './types'
import type { MappingIcon } from './utilsType'

export const generateTwClassName = <T extends string | number>(
  classList: { [key in T]: string | number } & { auto?: string; default?: string },
  value?: string,
) => {
  const isNumber = typeof value === 'number'

  if (!isNumber && !value) {
    if (classList?.auto) return classList.auto

    if (classList?.default) return classList.default
  }

  const theValue = value as keyof typeof classList

  return classList[theValue]
}

export const generateTwScreenClassName = <T extends string | number>(
  classList: TwScreenStyle<T | string | number>,
  value?: unknown,
) => {
  const isNumber = typeof value === 'number'
  const isString = typeof value === 'string'

  if (!isNumber && !value) {
    if (classList?.default?.auto) return classList.default.auto

    if (classList?.default?.default) return classList.default.default

    return classList.default[1]
  }

  if (isNumber || isString) return classList.default[value]

  const cls = Object.entries(value).map(([key, val]) => {
    const _key = key as keyof typeof classList

    return classList[_key][val as never]
  })

  return cls.join(' ')
}

export const kebabToCapital = (str: string) => {
  return str.replace(/^-*(.)|-+(.)/g, (s, c, d) => (c ? c.toUpperCase() : ' ' + d.toUpperCase()))
}

export const toSelection =
  <T extends string>(enumItem: Record<string, string>) =>
  <U = string>(mappingIcon?: MappingIcon<T, U>) => {
    return Object.entries(enumItem).map(([key, value]) => {
      return {
        key: value as T,
        label: kebabToCapital(enumItem[key]),
        icon: mappingIcon?.[value as T],
      }
    })
  }

// NOTE: Prepare tw class on JIT mode
// ! !text-primary !text-secondary !text-success !text-warning !text-danger !text-info !text-white !text-black !text-zinc-500
// ! !bg-primary !bg-secondary !bg-success !bg-warning !bg-danger !bg-info !bg-white !bg-black !bg-zinc-500
// ! !border-primary !border-secondary !border-success !border-warning !border-danger !border-info !border-white !border-black !border-zinc-500
// ! !stroke-primary !stroke-secondary !stroke-success !stroke-warning !stroke-danger !stroke-info !stroke-white !stroke-black !stroke-zinc-500
// ! !fill-primary !fill-secondary !fill-success !fill-warning !fill-danger !fill-info !fill-white !fill-black !fill-zinc-500
export const handleTwColor = (c: TwColorSemantic, type?: 'text' | 'bg' | 'border' | 'stroke' | 'fill') => {
  const _type = type || 'text'

  if (c === 'default') return `!${_type}-black`
  if (c === 'zinc') return `!${_type}-zinc-500`
  if (c === 'neutral') return `!${_type}-neutral-300`

  return `!${_type}-${c}`
}
