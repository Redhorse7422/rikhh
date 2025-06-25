'use client'

import type { InputWrapperProps } from './InputWrapper'

import { useId, useState } from 'react'

import { ChevronUpIcon } from '@/assets/icons'
import { cn } from '@/libs/utils'

import { InputWrapper } from './InputWrapper'

export type SelectInputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'placeholder'
  | 'name'
  | 'id'
  | 'required'
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'maxLength'
  | 'readOnly'
  | 'onBlur'
  | 'onKeyDown'
  | 'style'
> &
  Pick<
    InputWrapperProps,
    | 'errorMsg'
    | 'isError'
    | 'freezeErrorSpace'
    | 'labelAxis'
    | 'width'
    | 'classNames'
    | 'size'
    | 'labelWidth'
    | 'disabledErrorMsg'
    | 'helperText'
  > & {
    refInput?: React.RefObject<HTMLInputElement>
    label?: string
    prefixIcon?: React.ReactNode
    items: { value: string; label: string }[]
    // iconPrefix?: IconAllowed
    // iconSuffix?: IconAllowed
    onChange?: (value?: string) => void
    onEnter?: (value?: string) => void
    className?: string
  }

// type PropsType = {
//   label: string
//   items: { value: string; label: string }[]
//   prefixIcon?: React.ReactNode
//   className?: string
//   required?: boolean
// } & ({ placeholder?: string; defaultValue: string } | { placeholder: string; defaultValue?: string })

export type SelectProps = SelectInputProps

export function Select({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  className,
  required,
  isError,
  errorMsg,
  freezeErrorSpace,
  width,
  labelAxis,
  classNames,
  labelWidth,
  size = 'middle',
  disabledErrorMsg,
  helperText,
  // labelSize,
  // tokenSeparators,
  // control,
  // rules,
}: SelectProps) {
  const id = useId()

  const [isOptionSelected, setIsOptionSelected] = useState(false)

  return (
    <InputWrapper
      label={label}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      className={className}
      classNames={classNames}
      labelAxis={labelAxis}
      width={width}
      size={size}
      labelWidth={labelWidth}
      disabledErrorMsg={disabledErrorMsg}
      helperText={helperText}
    >
      <div className={cn('space-y-3', className)}>
        <div className='relative'>
          {prefixIcon && <div className='absolute left-4 top-1/2 -translate-y-1/2'>{prefixIcon}</div>}

          <select
            id={id}
            defaultValue={defaultValue || ''}
            onChange={() => setIsOptionSelected(true)}
            className={cn(
              'w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6',
              isOptionSelected && 'text-dark dark:text-white',
              prefixIcon && 'pl-11.5',
            )}
          >
            {placeholder && (
              <option value='' disabled hidden>
                {placeholder}
              </option>
            )}

            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <ChevronUpIcon className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180' />
        </div>
      </div>
    </InputWrapper>
  )
}
