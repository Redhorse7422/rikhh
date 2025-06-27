'use client'

import type { Control } from 'react-hook-form'

import React, { useState, useRef, useEffect } from 'react'

import { Icon } from '@/components/common/icon'
import { cn } from '@/libs/utils'

import { Controller } from './Controller'
import { InputWrapper } from './InputWrapper'

export type MultiSelectOption = {
  value: string
  label: string
}

export type MultiSelectFieldProps = {
  name: string
  control: Control<any>
  label?: string
  items: MultiSelectOption[]
  placeholder?: string
  required?: boolean
  isError?: boolean
  errorMsg?: string
  freezeErrorSpace?: boolean
  labelAxis?: 'horizontal' | 'vertical'
  labelWidth?: number
  className?: string
  rules?: any
}

const MultiSelectInput: React.FC<{
  value?: string[]
  onChange?: (value: string[]) => void
  items: MultiSelectOption[]
  placeholder?: string
  isError?: boolean
  label?: string
  required?: boolean
  freezeErrorSpace?: boolean
  labelAxis?: 'horizontal' | 'vertical'
  labelWidth?: number
  className?: string
  errorMsg?: string
}> = ({
  value = [],
  onChange,
  items,
  placeholder = 'Select options...',
  isError = false,
  label: inputLabel,
  required = false,
  freezeErrorSpace = false,
  labelAxis = 'vertical',
  labelWidth,
  className,
  errorMsg,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(value)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync with external value
  useEffect(() => {
    setSelectedValues(value || [])
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue]

    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  const handleRemoveOption = (optionValue: string) => {
    const newValues = selectedValues.filter((v) => v !== optionValue)
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  const getSelectedLabels = () => {
    return items.filter((item) => selectedValues.includes(item.value)).map((item) => item.label)
  }

  return (
    <InputWrapper
      label={inputLabel}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      labelAxis={labelAxis}
      labelWidth={labelWidth}
      className={className}
    >
      <div className='relative w-full' ref={dropdownRef}>
        {/* Selected values display */}
        <div
          className={cn(
            'min-h-[44px] w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary',
            isError && 'border-red-500',
            'cursor-pointer',
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex flex-wrap gap-2'>
            {selectedValues.length > 0 ? (
              getSelectedLabels().map((label, index) => (
                <span
                  key={index}
                  className='inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm text-primary'
                >
                  {label}
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveOption(items.find((item) => item.label === label)?.value || '')
                    }}
                    className='ml-1 text-primary hover:text-primary/70'
                  >
                    <Icon name='AiOutlineClose' size='sm' />
                  </button>
                </span>
              ))
            ) : (
              <span className='text-dark-5 dark:text-dark-6'>{placeholder}</span>
            )}
          </div>

          {/* Dropdown arrow */}
          <Icon
            name='AiOutlineRight'
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 rotate-90 transition-transform',
              isOpen && 'rotate-[-90deg]',
            )}
            size='sm'
          />
        </div>

        {/* Dropdown options */}
        {isOpen && (
          <div className='absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2'>
            {items.map((item) => (
              <div
                key={item.value}
                className={cn(
                  'flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-3',
                  selectedValues.includes(item.value) && 'bg-primary/5',
                )}
                onClick={() => handleToggleOption(item.value)}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'h-4 w-4 rounded border-2 transition-colors',
                      selectedValues.includes(item.value)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300 dark:border-dark-6',
                    )}
                  >
                    {selectedValues.includes(item.value) && (
                      <Icon name='AiOutlineCheck' className='text-white' size='xs' />
                    )}
                  </div>
                  <span className='text-sm'>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  control,
  label,
  items,
  placeholder = 'Select options...',
  required = false,
  isError = false,
  errorMsg,
  freezeErrorSpace = false,
  labelAxis = 'vertical',
  labelWidth,
  className,
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      Input={MultiSelectInput}
      inputProps={{
        items,
        placeholder,
        isError,
        errorMsg,
        freezeErrorSpace,
        labelAxis,
        labelWidth,
        className,
        label,
        required,
      }}
    />
  )
}
