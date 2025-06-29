'use client'

import type { InputWrapperProps } from '../InputWrapper'
import type { FileWithPreview } from '../UploadInput/UploadInput'
import type { IconAllowed } from '@/components/common/icon'
import type { UseFormStateReturn } from 'react-hook-form'

import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Icon } from '@/components/common/icon'

import { InputWrapper } from '../InputWrapper'
import { UploadInput } from '../UploadInput/UploadInput'

export type RepeaterItem = {
  id: string
  [key: string]: any
}

export type RepeaterFieldConfig = {
  name: string
  label: string
  type: 'text' | 'number' | 'file'
  required?: boolean
  placeholder?: string
  accept?: string[]
  multiple?: boolean
  maxCount?: number
}

export type RepeaterInputProps = Pick<
  InputWrapperProps,
  | 'errorMsg'
  | 'isError'
  | 'freezeErrorSpace'
  | 'labelAxis'
  | 'width'
  | 'classNames'
  | 'size'
  | 'labelWidth'
  | 'labelPosition'
> & {
  required?: boolean
  label?: string
  value?: RepeaterItem[]
  onChange?: (items: RepeaterItem[]) => void
  fields: RepeaterFieldConfig[]
  disabled?: boolean
  className?: string
  addButtonText?: string
  removeButtonText?: string
  formState?: UseFormStateReturn<any>
}

export const RepeaterInput: React.FC<RepeaterInputProps> = ({
  label,
  required,
  isError,
  errorMsg,
  freezeErrorSpace,
  width,
  labelAxis,
  className,
  classNames,
  labelWidth,
  labelPosition,
  size = 'middle',
  value = [],
  onChange,
  fields,
  disabled = false,
  addButtonText = 'Add Item',
  removeButtonText = 'Remove',
  formState,
}) => {
  const [items, setItems] = useState<RepeaterItem[]>(value)

  // Sync with external value changes
  useEffect(() => {
    console.log('RepeaterInput received value:', value)
    setItems(value)
  }, [value])

  // Determine if errors should be shown
  const showErrors = formState?.isSubmitted || formState?.isSubmitting || formState?.isSubmitSuccessful

  const addItem = () => {
    if (disabled) return

    const newItem: RepeaterItem = {
      id: Math.random().toString(36).slice(2, 11),
    }

    // Initialize fields with default values
    fields.forEach((field) => {
      if (field.type === 'number') {
        newItem[field.name] = 0
      } else if (field.type === 'file') {
        newItem[field.name] = []
      } else {
        newItem[field.name] = ''
      }
    })

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    onChange?.(updatedItems)
  }

  const removeItem = (id: string) => {
    if (disabled) return

    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    onChange?.(updatedItems)
  }

  const updateItem = (id: string, fieldName: string, fieldValue: any) => {
    if (disabled) return

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [fieldName]: fieldValue } : item
    )
    setItems(updatedItems)
    onChange?.(updatedItems)
  }

  const renderField = (item: RepeaterItem, field: RepeaterFieldConfig) => {
    const fieldValue = item[field.name]
    const isFieldRequired = field.required
    const isFieldEmpty = fieldValue === '' || fieldValue === 0 || (Array.isArray(fieldValue) && fieldValue.length === 0)
    const showFieldError = isFieldRequired && isFieldEmpty && showErrors

    if (field.type === 'number') {
      return (
        <div className="space-y-1">
          <input
            type="number"
            value={fieldValue || ''}
            onChange={(e) => updateItem(item.id, field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            className={clsx(
              'w-full rounded-lg border bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:bg-dark-2',
              showFieldError 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-stroke focus:border-primary dark:border-dark-3'
            )}
            disabled={disabled}
          />
          {showFieldError && (
            <div className="text-xs text-red-500">
              {field.label} is required
            </div>
          )}
        </div>
      )
    } else if (field.type === 'file') {
      return (
        <div className="space-y-1">
          <UploadInput
            value={fieldValue || []}
            onChange={(files: FileWithPreview[]) => updateItem(item.id, field.name, files)}
            accept={field.accept}
            multiple={field.multiple}
            maxCount={field.maxCount}
            disabled={disabled}
            dragBoxTitle="Drop image here"
            dragBoxDesc="or click to browse"
          />
          {showFieldError && (
            <div className="text-xs text-red-500">
              {field.label} is required
            </div>
          )}
        </div>
      )
    } 
      return (
        <div className="space-y-1">
          <input
            type="text"
            value={fieldValue || ''}
            onChange={(e) => updateItem(item.id, field.name, e.target.value)}
            placeholder={field.placeholder}
            className={clsx(
              'w-full rounded-lg border bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:bg-dark-2',
              showFieldError 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-stroke focus:border-primary dark:border-dark-3'
            )}
            disabled={disabled}
          />
          {showFieldError && (
            <div className="text-xs text-red-500">
              {field.label} is required
            </div>
          )}
        </div>
      )
    
  }

  return (
    <InputWrapper
      label={label}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      labelAxis={labelAxis}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      width={width}
      size={size}
      classNames={classNames}
      className={className}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-dark dark:text-white">
                Variation {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={disabled}
                className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
              >
                <Icon name="AiOutlineDelete" size="xs" />
                {removeButtonText}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-xs font-medium text-dark dark:text-white">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(item, field)}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addItem}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stroke bg-transparent py-4 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white dark:hover:border-primary disabled:opacity-50"
        >
          <Icon name="AiOutlinePlus" size="sm" />
          {addButtonText}
        </button>
      </div>
    </InputWrapper>
  )
} 
