'use client'

import React from 'react'
import clsx from 'clsx'

// import type { IconAllowed } from '@/components/Common/Icon'
// import { Icon } from '@/components/Common/Icon'

import { InputWrapper, type InputWrapperProps } from '../InputWrapper'
import { Icon, IconAllowed } from '@/components/common/icon'

export type TextInputProps = Pick<
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
    prefixIcon?: IconAllowed
    suffixIcon?: IconAllowed
    onChange?: (value?: string) => void
    onEnter?: (value?: string) => void
    className?: string
  }

export const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    refInput,
    label,
    required,
    isError,
    errorMsg,
    disabledErrorMsg,
    freezeErrorSpace,
    className,
    labelAxis,
    width,
    classNames,
    labelWidth,
    size = 'middle',
    helperText,
    prefixIcon,
    suffixIcon,
    onChange,
    onBlur,
    onEnter,
    ...inputProps
  } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.((e.target as HTMLInputElement).value)
    }
  }

  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    middle: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3',
  }

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
      <div className='relative w-full'>
        {prefixIcon && (
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <Icon name={prefixIcon} />
          </span>
        )}

        <input
          ref={refInput}
          className={clsx(
            'w-full rounded-md border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary',
            sizeClasses[size],
            // iconPrefix && 'pl-10',
            // iconSuffix && 'pr-10',
            classNames?.input,
          )}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={handleEnter}
          {...inputProps}
        />

        {suffixIcon && (
          <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <Icon name={suffixIcon} />
          </span>
        )}
      </div>
    </InputWrapper>
  )
}
