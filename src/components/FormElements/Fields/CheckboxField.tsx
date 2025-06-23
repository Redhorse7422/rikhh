'use client'

import type { ControllerProps } from '../Controller'
import type { PropsType as CheckboxInputProps } from '../checkbox'
import React from 'react'
import { Controller } from '../Controller'
import { Checkbox } from '../checkbox'

type CheckboxFieldProps = Omit<CheckboxInputProps, 'name'> &
  Required<Pick<CheckboxInputProps, 'name'>> &
  Pick<ControllerProps, 'control' | 'rules'>

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={Checkbox} inputProps={{ ...props }} />
} 