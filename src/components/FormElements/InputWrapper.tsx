import React, { useEffect } from 'react'
import clsx from 'clsx'
import { Flex } from '../common/Flex'
import { Text } from '../common/Text'
import { FixWidthInput, getWidth } from './utils'

export type InputWrapperProps = {
  label?: string
  required?: boolean
  children: React.ReactNode
  isError?: boolean
  errorMsg?: string
  freezeErrorSpace?: boolean
  className?: string
  classNames?: {
    wrapper?: string
    input?: string
    label?: string
  }
  labelAxis?: 'horizontal' | 'vertical'
  width?: FixWidthInput
  labelWidth?: number
  labelPosition?: 'start' | 'end' | 'center'
  size?: 'small' | 'middle' | 'large'
  disabledErrorMsg?: boolean
  helperText?: string
  validationRules?: Array<{
    text: string
    passed: boolean
  }>
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  label,
  required,
  isError,
  errorMsg,
  disabledErrorMsg,
  freezeErrorSpace,
  className,
  classNames,
  labelAxis = 'vertical',
  width,
  labelWidth,
  size,
  labelPosition = 'center',
  helperText,
  validationRules,
}) => {
  const labelRef = React.useRef<HTMLSpanElement>(null)
  const blankLabelRef = React.useRef<HTMLDivElement>(null)
  const isVertical = labelAxis === 'vertical'
  const isHorizontal = labelAxis === 'horizontal'
  const idLabel = `label-${label}`
  const idBlankLabel = `blank-label-${label}`

  const getSizeLabel = () => {
    if (size === 'small') return 'xs'
    if (size === 'large') return 'md'

    return 'sm'
  }

  const getAlignLabel = () => {
    if (isVertical) return 'start'

    return labelPosition
  }

  useEffect(() => {
    if (labelRef.current && blankLabelRef.current && isHorizontal) {
      const calcBlankWidthLabel = () => {
        const labelEl = labelRef.current
        const blankLabelEl = blankLabelRef.current

        if (isHorizontal && labelEl && blankLabelEl) {
          blankLabelEl.style.width = `${labelEl.offsetWidth}px`
        }
      }

      calcBlankWidthLabel()
    }
  }, [isHorizontal, isVertical, labelWidth])

  return (
    <Flex vertical className='mb-2 w-full'>
      <Flex
        vertical={isVertical}
        align={getAlignLabel()}
        gap={isHorizontal ? 'small' : undefined}
        className={clsx(className, getWidth(width), classNames?.wrapper)}
        style={{ ...(typeof width === 'number' && { minWidth: width }) }}
      >
        {label && (
          <Text
            ref={labelRef}
            id={idLabel}
            // decoration='strong'
            noWrap={isHorizontal}
            className={clsx(isVertical && 'mb-1', isHorizontal && 'text-end', classNames?.label)}
            {...(isHorizontal && labelWidth && { style: { minWidth: labelWidth } })}
          >
            {required && isHorizontal && <Text color='text-red-500'>*</Text>} {label}{' '}
            {required && isVertical && <Text color='text-red-500'>*</Text>}
          </Text>
        )}

        {children}

        {isVertical && !disabledErrorMsg && (
          <>
            {isError && <Text color='danger'>{errorMsg}</Text>}
            {validationRules && (
              <div className='mt-1 flex flex-col gap-1'>
                {validationRules.map((rule, index) => (
                  <Text
                    key={index}
                    className={clsx('flex items-center gap-2', rule.passed ? 'text-green-600' : 'text-red-500')}
                  >
                    {rule.passed ? (
                      <span className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-white text-green-600'>
                        <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                      </span>
                    ) : (
                      <span className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-white text-red-500'>
                        <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </span>
                    )}
                    {rule.text}
                  </Text>
                ))}
              </div>
            )}
            {!isError && freezeErrorSpace && !helperText && <div className='h-[24px]' />}
          </>
        )}

        {isVertical && helperText && !isError && (
          <Text color='secondary' className='mt-1'>
            {helperText}
          </Text>
        )}
      </Flex>

      {isHorizontal && !disabledErrorMsg && (
        <Flex gap={isHorizontal ? 'small' : undefined}>
          <div
            ref={blankLabelRef}
            id={idBlankLabel}
            {...(isHorizontal && labelWidth && { style: { minWidth: labelWidth } })}
          />

          {isError && <Text color='danger'>{errorMsg}</Text>}
          {!isError && freezeErrorSpace && <div className='h-[24px]' />}
        </Flex>
      )}

      {isHorizontal && helperText && !disabledErrorMsg && (
        <Flex gap={isHorizontal ? 'small' : undefined}>
          <div
            ref={blankLabelRef}
            id={idBlankLabel}
            {...(isHorizontal && labelWidth && { style: { minWidth: labelWidth } })}
          />

          <Text color='secondary' className='mt-1'>
            {!isError && helperText}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
