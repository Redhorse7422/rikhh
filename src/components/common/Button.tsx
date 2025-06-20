import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 transition focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        green: 'bg-green text-white',
        dark: 'bg-dark text-white dark:bg-white/10',
        outlinePrimary: 'border border-primary hover:bg-primary/10 text-primary',
        outlineGreen: 'border border-green hover:bg-green/10 text-green',
        outlineDark:
          'border border-dark hover:bg-dark/10 text-dark dark:hover:bg-white/10 dark:border-white/25 dark:text-white',
      },
      shape: {
        default: '',
        rounded: 'rounded-[5px]',
        full: 'rounded-full',
      },
      size: {
        default: 'py-3.5 px-10 lg:px-8 xl:px-10',
        small: 'py-[11px] px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      shape: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    label: string
    icon?: ReactNode
    loading?: boolean
    fullWidth?: boolean
    htmlType?: 'button' | 'submit' | 'reset'
  }

export function Button({
  label,
  icon,
  variant,
  shape,
  size,
  className,
  loading = false,
  fullWidth = false,
  htmlType = 'button',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={htmlType}
      disabled={disabled || loading}
      className={clsx(
        buttonVariants({ variant, shape, size }),
        {
          'w-full': fullWidth,
        },
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className='animate-pulse'>Loading...</span>
      ) : (
        <>
          {icon && <span className='flex-shrink-0'>{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
