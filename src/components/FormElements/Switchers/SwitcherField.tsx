import type { Control, FieldValues, FieldPath, RegisterOptions } from 'react-hook-form'

import React from 'react'

import { Controller } from '../Controller'
import { InputWrapper } from '../InputWrapper'

import SwitcherInput from './SwitcherInput'

type SwitcherFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  labelAxis?: 'horizontal' | 'vertical'
  labelWidth?: number
  className?: string
  rules?: RegisterOptions
  disabled?: boolean
  required?: boolean
  errorMsg?: string
  freezeErrorSpace?: boolean
}

export function SwitcherField<T extends FieldValues>({
  name,
  control,
  label,
  labelAxis = 'horizontal',
  labelWidth,
  className,
  rules,
  disabled,
  required,
  errorMsg,
  freezeErrorSpace,
}: SwitcherFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      Input={({ value, onChange, refInput, ...inputProps }) => (
        <InputWrapper
          label={label}
          required={required}
          isError={inputProps.isError}
          errorMsg={inputProps.errorMsg || errorMsg}
          freezeErrorSpace={freezeErrorSpace}
          className={className}
          labelAxis={labelAxis}
          labelWidth={labelWidth}
        >
          <SwitcherInput checked={!!value} onChange={onChange} disabled={disabled} refInput={refInput} name={name} />
        </InputWrapper>
      )}
      inputProps={{}}
    />
  )
}
