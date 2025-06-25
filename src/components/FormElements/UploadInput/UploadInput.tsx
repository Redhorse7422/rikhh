'use client'

import type { InputWrapperProps } from '../InputWrapper'
import type { IconAllowed } from '@/components/common/icon'

import React, { useState, useRef, useCallback, useEffect } from 'react'

import clsx from 'clsx'

import { Icon } from '@/components/common/icon'

import { InputWrapper } from '../InputWrapper'

export type FileWithPreview = {
  id: string
  file: File
  preview: string | null
  name: string
  size: number
  type: string
}

export type UploadInputProps = Pick<
  InputWrapperProps,
  | 'errorMsg'
  | 'isError'
  | 'freezeErrorSpace'
  | 'labelAxis'
  | 'width'
  | 'classNames'
  | 'size'
  | 'labelWidth'
  | 'labelPosition'
> & {
  required?: boolean
  label?: string
  iconPrefix?: IconAllowed
  iconSuffix?: IconAllowed
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
  accept?: string[]
  multiple?: boolean
  maxCount?: number
  disabled?: boolean
  dragBoxTitle?: string | React.ReactNode
  dragBoxDesc?: string | React.ReactNode
  className?: string
}

export const UploadInput: React.FC<UploadInputProps> = (props) => {
  const {
    label,
    required,
    isError,
    errorMsg,
    freezeErrorSpace,
    // Fixed: Set default maxCount based on multiple flag
    maxCount: initialMaxCount,
    width,
    labelAxis,
    className,
    classNames,
    labelWidth,
    labelPosition,
    size = 'middle',
    value = [],
    onChange,
    multiple = false,
    accept = ['image/*', '.webp'],
    disabled = false,
    dragBoxTitle = 'Drag & drop files here',
    dragBoxDesc = 'or click to browse',
  } = props

  // Compute maxCount: if not provided, use 1 for single mode and undefined for multiple
  const maxCount = initialMaxCount ?? (multiple ? undefined : 1)

  const [files, setFiles] = useState<FileWithPreview[]>(value)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync with external value changes
  useEffect(() => {
    setFiles(value)
  }, [value])

  // Create previews and file objects
  const processFiles = useCallback(
    (newFiles: File[]) => {
      const processed: FileWithPreview[] = []

      for (const file of newFiles) {
        // Skip if we've reached max count (only when maxCount is defined)
        if (maxCount !== undefined && files.length + processed.length >= maxCount) break

        processed.push({
          id: Math.random().toString(36).slice(2, 11),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      }

      return processed
    },
    [files.length, maxCount],
  )

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = processFiles(Array.from(e.target.files))
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
    e.target.value = '' // Reset input to allow selecting same file again
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const newFiles = processFiles(Array.from(e.dataTransfer.files))
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }

  // Remove file from selection
  const removeFile = (id: string) => {
    if (disabled) return

    const updatedFiles = files.filter((file) => {
      if (file.id === id && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return file.id !== id
    })

    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }

  // Clean up preview URLs
  useEffect(() => {
    return () =>
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
  }, [files])

  // Trigger file input click
  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // File size formatter
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  // Get accept string for input
  const acceptString = accept?.join(',')

  // Fixed: Proper dropzone visibility logic
  const showDropzone = multiple ? maxCount === undefined || files.length < maxCount : files.length === 0

  return (
    <InputWrapper
      label={label}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      className={className}
      classNames={classNames}
      labelAxis={labelAxis}
      width={width}
      size={size}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
    >
      <div className='relative w-full'>
        {/* Dropzone Area */}
        {showDropzone && (
          <div
            className={clsx(
              'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
              disabled ? 'cursor-not-allowed bg-gray-100' : 'hover:border-blue-400',
              isError && 'border-red-500',
            )}
            onClick={triggerFileInput}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
              multiple={multiple}
              accept={acceptString}
              disabled={disabled}
            />

            <div className='flex flex-col items-center justify-center gap-2'>
              <Icon name={isDragging ? 'AiOutlineUpload' : 'AiOutlineFile'} className='text-gray-400' size='2xl' />
              <div>
                <p className='font-medium'>{dragBoxTitle}</p>
                <p className='text-sm text-gray-500'>{dragBoxDesc}</p>
              </div>
              {accept && accept.length > 0 && (
                <p className='text-sm text-gray-500'>
                  {' '}
                  Accepted: {accept.map((ext) => (ext.startsWith('.') ? ext.slice(1) : ext)).join(', ')}
                </p>
              )}
              {maxCount && maxCount > 1 && <p className='text-sm text-gray-500'>Max files: {maxCount}</p>}
            </div>
          </div>
        )}

        {/* File Previews */}
        {files.length > 0 && (
          <div className='mt-2'>
            <h3 className='mb-2 text-sm font-medium'>
              Selected Files ({files.length}
              {maxCount ? `/${maxCount}` : ''})
            </h3>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={clsx(
                    'overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md',
                    isError ? 'border-red-300' : 'border-gray-200',
                  )}
                >
                  <div className='relative flex aspect-square items-center justify-center bg-gray-50'>
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className='h-full w-full object-cover' />
                    ) : (
                      <div className='flex flex-col items-center p-4 text-center'>
                        <Icon name='AiOutlineFileText' className='text-gray-400' size='xl' />
                        <span className='mt-2 w-full truncate px-2 text-xs text-gray-500'>{file.name}</span>
                      </div>
                    )}

                    {!disabled && (
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(file.id)
                        }}
                        className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600'
                      >
                        <Icon name='AiOutlineClose' size='sm' />
                      </button>
                    )}
                  </div>

                  <div className='bg-white p-2'>
                    <p className='truncate text-xs font-medium'>{file.name}</p>
                    <p className='text-xs text-gray-500'>
                      {formatFileSize(file.size)} · {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </InputWrapper>
  )
}
