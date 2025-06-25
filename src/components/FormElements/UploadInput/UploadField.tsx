'use client'

import type { ControllerProps } from '../Controller'
import type { UploadInputProps } from './UploadInput'

import React from 'react'

import { Controller } from '../Controller'

import { UploadInput } from './UploadInput'

type UploadFieldProps = Omit<UploadInputProps, 'type'> & {
  name: string
} & Pick<ControllerProps, 'control' | 'rules'>

export const UploadField: React.FC<UploadFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={UploadInput} inputProps={{ ...props }} />
}
