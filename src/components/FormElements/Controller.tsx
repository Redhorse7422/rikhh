/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, UseControllerProps } from 'react-hook-form'

import { Controller as RhfController } from 'react-hook-form'

export type ControllerProps = {
  control: Control<any>
  name: string
  rules?: UseControllerProps['rules']
  Input: React.FC<any>
  inputProps: object & {
    errorMsg?: string
    onChange?: (v?: any, options?: any) => void
    disabled?: boolean
    readonly?: boolean
    freezeErrorSpace?: boolean
    validationRules?: Array<{
      text: string
      passed: boolean
    }>
    [key: string]: any
  }
}

export const Controller: React.FC<ControllerProps> = ({ control, name, rules, Input, inputProps }) => {
  return (
    <RhfController
      control={control}
      name={name}
      rules={rules}
      disabled={inputProps?.disabled}
      render={({ field, fieldState }) => {
        const { invalid, error } = fieldState
        const errorField = error

        // Don't show default error message for password fields
        const isPasswordField = name === 'password' || name === 'confirmPassword'
        const errorMessage = invalid && !isPasswordField ? errorField?.message || inputProps?.errorMsg : undefined

        return (
          <Input
            {...inputProps}
            refInput={field.ref}
            name={field.name}
            value={field.value}
            onChange={(...v: any) => {
              inputProps?.onChange?.(...v)
              field?.onChange(...v)
            }}
            disabled={inputProps?.disabled || inputProps?.readonly}
            required={rules?.required || false}
            isError={invalid}
            status={invalid ? 'error' : ''}
            errorMsg={errorMessage}
            freezeErrorSpace={inputProps?.freezeErrorSpace}
          />
        )
      }}
    />
  )
}
