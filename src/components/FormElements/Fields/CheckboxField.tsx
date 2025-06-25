'use client'

import type { CheckboxInputProps } from '../CheckboxInput'
import type { ControllerProps } from '../Controller'

import React from 'react'

import { CheckboxInput } from '../CheckboxInput'
import { Controller } from '../Controller'

type CheckboxFieldProps = Omit<CheckboxInputProps, 'name'> &
  Required<Pick<CheckboxInputProps, 'name'>> &
  Pick<ControllerProps, 'control' | 'rules'>

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ control, rules, ...props }) => {
  return (
    <Controller control={control} name={props.name} rules={rules} Input={CheckboxInput} inputProps={{ ...props }} />
  )
}
