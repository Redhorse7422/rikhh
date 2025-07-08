'use client'

import type { RepeaterFieldConfig, RepeaterItem } from './RepeaterInput'
import type { Control } from 'react-hook-form'

import React from 'react'

import { Controller } from '../Controller'

import { RepeaterInput } from './RepeaterInput'

export type RepeaterFieldProps = {
  name: string
  control: Control<any>
  label?: string
  fields: RepeaterFieldConfig[]
  required?: boolean
  isError?: boolean
  errorMsg?: string
  freezeErrorSpace?: boolean
  labelAxis?: 'horizontal' | 'vertical'
  labelWidth?: number
  className?: string
  rules?: any
  addButtonText?: string
  removeButtonText?: string
}

export const RepeaterField: React.FC<RepeaterFieldProps & any> = ({
  name,
  control,
  label,
  fields,
  required = false,
  isError = false,
  errorMsg,
  freezeErrorSpace = false,
  labelAxis = 'vertical',
  labelWidth,
  className,
  rules,
  addButtonText,
  removeButtonText,
  ...rest
}) => {
  // Get formState from control if available
  const formState = (control as any)?._formState || undefined
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      Input={RepeaterInput}
      inputProps={{
        fields,
        label,
        required,
        isError,
        errorMsg,
        freezeErrorSpace,
        labelAxis,
        labelWidth,
        className,
        addButtonText,
        removeButtonText,
        formState,
        ...rest,
      }}
    />
  )
} 
