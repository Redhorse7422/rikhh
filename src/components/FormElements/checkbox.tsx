'use client'

import React, { useState } from 'react'

import clsx from 'clsx'

export interface CheckboxProps {
  label?: string
  withIcon?: 'check' | 'x'
  minimal?: boolean
  withBg?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  name?: string
  value?: boolean
  checked?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label = 'Checkbox Text',
  withIcon,
  minimal = false,
  withBg = false,
  defaultChecked = false,
  onChange,
  className,
  name,
  checked,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  // Use controlled state if checked prop is provided
  const isControlled = checked !== undefined
  const currentChecked = isControlled ? checked : isChecked

  const handleChange = () => {
    const newValue = !currentChecked
    if (!isControlled) {
      setIsChecked(newValue)
    }
    onChange?.(newValue)
  }

  const getIcon = () => {
    if (!withIcon) return null

    if (withIcon === 'check') {
      return (
        <svg width='11' height='8' viewBox='0 0 11 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='0.4'
          />
        </svg>
      )
    }

    if (withIcon === 'x') {
      return (
        <svg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M1 1L7 7M7 1L1 7'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      )
    }

    return null
  }

  return (
    <div className={clsx('flex items-center', className)}>
      <label className='flex cursor-pointer select-none items-center text-body-sm font-medium'>
        <div className='relative'>
          <input type='checkbox' name={name} className='sr-only' checked={currentChecked} onChange={handleChange} />
          <div
            className={clsx('mr-2 flex h-5 w-5 items-center justify-center rounded border transition-colors', {
              'border-primary bg-primary text-white': currentChecked && !minimal,
              'border-gray-300 bg-gray-50': !currentChecked && !minimal,
              'border-gray-300': minimal,
              'bg-gray-100': withBg && !currentChecked,
              'bg-primary': withBg && currentChecked,
            })}
          >
            {currentChecked && (
              <span
                className={clsx('flex items-center justify-center', {
                  'text-white': !minimal,
                  'text-primary': minimal,
                })}
              >
                {getIcon() || (
                  <svg width='11' height='8' viewBox='0 0 11 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z'
                      fill='currentColor'
                      stroke='currentColor'
                      strokeWidth='0.4'
                    />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
        {label}
      </label>
    </div>
  )
}
