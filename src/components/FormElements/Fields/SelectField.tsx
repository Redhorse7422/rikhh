'use client'

import type { ControllerProps } from '../Controller'
import type { SelectProps } from '../select'
import React from 'react'
import { Controller } from '../Controller'
import { Select } from '../select'

type SelectFieldProps = {
  name: string;
} & Partial<SelectProps> & Pick<ControllerProps, 'control' | 'rules'>;

export const SelectField: React.FC<SelectFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={Select} inputProps={{ ...props }} />
} 