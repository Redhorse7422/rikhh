'use client'

import type { InputWrapperProps } from '../InputWrapper'
import type { IconAllowed } from '@/components/common/icon'

import { useId, useState } from 'react'

import { ChevronUpIcon } from '@/assets/icons'
import { Icon } from '@/components/common/icon'
import { cn } from '@/libs/utils'

import { InputWrapper } from '../InputWrapper'


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
    value?: string
    refInput?: React.RefObject<HTMLInputElement>
    label?: string
    items: { value: string; label: string }[]
    prefixIcon?: IconAllowed
    suffixIcon?: IconAllowed
    onChange?: (value?: string) => void
    onEnter?: (value?: string) => void
    className?: string
  }

export type SelectProps = SelectInputProps

export function SelectInput({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  suffixIcon,
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
  ...leftProps
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
      <div className={cn('w-full space-y-3', className)}>
        <div className='relative'>
          {prefixIcon && <Icon name={prefixIcon} />}

          <select
            id={id}
            value={leftProps.value || ''}
            onChange={(e) => {
              setIsOptionSelected(true)
              leftProps.onChange?.(e.target.value)
            }}
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

          {suffixIcon && <Icon name={suffixIcon} />}

          <ChevronUpIcon className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180' />
        </div>
      </div>
    </InputWrapper>
  )
}
