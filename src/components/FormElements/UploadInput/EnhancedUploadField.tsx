'use client'

import type { ControllerProps } from '../Controller'
import type { EnhancedUploadInputProps } from './EnhancedUploadInput'

import React from 'react'

import { Controller } from '../Controller'

import { EnhancedUploadInput } from './EnhancedUploadInput'

type EnhancedUploadFieldProps = Omit<EnhancedUploadInputProps, 'type'> & {
  name: string
} & Pick<ControllerProps, 'control' | 'rules'>

export const EnhancedUploadField: React.FC<EnhancedUploadFieldProps> = ({ control, rules, ...props }) => {
  return (
    <Controller
      control={control}
      name={props.name}
      rules={rules}
      Input={EnhancedUploadInput}
      inputProps={{
        ...props,
        // Ensure value is properly passed
        value: props.value || null,
      }}
    />
  )
}
