'use client'

import React, { useId } from 'react'

import clsx from 'clsx'

import { Text } from '@/components/common/Text'

import { InputWrapper, type InputWrapperProps } from '../InputWrapper'

export type CheckboxInputProps = Pick<
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
    defaultChecked?: boolean
    indeterminate?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onEnter?: (value?: string) => void
    className?: string
  }

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  onChange,
  disabled,
  indeterminate,
  defaultChecked,
  errorMsg,
  freezeErrorSpace,
  isError,
  value,
  width,
  labelAxis,
  classNames,
  labelWidth,
  className,
  required,
  size = 'middle',
  id,
  name,
  ...leftProps
}) => {
  const generatedId = useId()
  const inputId = id || generatedId

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
    >
      <div className={clsx('w-full space-y-3', className)}>
        <label
          htmlFor={inputId}
          className={clsx(
            'flex cursor-pointer select-none items-center gap-2 text-sm font-medium',
            disabled && 'cursor-not-allowed opacity-60',
            classNames?.label,
          )}
        >
          <div className='relative'>
            <input
              id={inputId}
              name={name}
              type='checkbox'
              checked={!!value}
              disabled={disabled}
              defaultChecked={defaultChecked}
              onChange={onChange}
              className='peer sr-only'
              aria-checked={indeterminate ? 'mixed' : !!value}
            />
            <div
              className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                !!value ? 'border-primary bg-gray-2 dark:bg-transparent' : 'border border-dark-5 dark:border-dark-6'
              }`}
            >
              <span className={`opacity-0 ${!!value && '!opacity-100'}`}>
                <svg width='11' height='8' viewBox='0 0 11 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z'
                    fill='#5750F1'
                    stroke='#5750F1'
                    strokeWidth='0.4'
                  />
                </svg>
              </span>
            </div>
            {/* <div
            className={clsx(
              'box flex h-5 w-5 items-center justify-center rounded-full border border-primary transition',
              !!value && '!border-4',
              indeterminate && 'border-none bg-primary',
              classNames?.checkbox,
            )}
          >
            <span className={clsx('h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent', !value && 'opacity-0')} />
          </div> */}
          </div>
        </label>

        {isError ? (
          <Text as='p' color='text-danger-500' className='!mb-0 mt-1'>
            {errorMsg}
          </Text>
        ) : (
          freezeErrorSpace && <div className='h-[24px]' />
        )}
      </div>
    </InputWrapper>
  )
}
