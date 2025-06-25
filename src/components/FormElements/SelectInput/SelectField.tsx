'use client'

import type { ControllerProps } from '../Controller'
import type { SelectProps } from './SelectInput'

import React from 'react'

import { Controller } from '../Controller'

import { SelectInput } from './SelectInput'

type SelectFieldProps = {
  name: string
} & Partial<SelectProps> &
  Pick<ControllerProps, 'control' | 'rules'>

export const SelectField: React.FC<SelectFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={SelectInput} inputProps={{ ...props }} />
}
