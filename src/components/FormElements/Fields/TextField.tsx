'use client'

import type { TextInputProps } from '../TextInput/TextInput'
import type { ControllerProps } from '../Controller'
import React from 'react'
import { Controller } from '../Controller'
import { TextInput } from '../TextInput/TextInput'

type TextFieldProps = Omit<TextInputProps, 'name' | 'type'> &
  Required<Pick<TextInputProps, 'name'>> &
  Pick<ControllerProps, 'control' | 'rules'>

export const TextField: React.FC<TextFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={TextInput} inputProps={{ ...props }} />
} 