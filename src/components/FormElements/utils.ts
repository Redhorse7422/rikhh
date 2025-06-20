export type FixWidthInput = 'auto' | 'fit' | 'full' | 'half' | 'wide' | number

export const getWidth = (width?: FixWidthInput) => {
  if (typeof width === 'number') {
    return 'w-auto'
  }

  switch (width) {
    case 'auto':
      return 'w-auto'
    case 'fit':
      return 'w-fit'
    case 'half':
      return 'w-1/2'
    case 'wide':
      return 'w-60'
    case 'full':
    default:
      return 'w-full'
  }
}
