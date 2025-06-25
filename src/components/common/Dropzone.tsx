// components/Dropzone.tsx
import type { ChangeEvent, DragEvent } from 'react'
import React, { useState, useRef, useCallback } from 'react'

type FileWithPreview = File & {
  preview: string
  id: string
}

const Dropzone: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create preview URLs and clean up
  const createPreviews = useCallback((filesList: File[]) => {
    const newFiles: FileWithPreview[] = Array.from(filesList).map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 9),
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  // Handle file selection via input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      createPreviews(Array.from(e.target.files))
    }
  }

  // Handle drag events
  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  // Handle file drop
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        createPreviews(Array.from(e.dataTransfer.files))
      }
    },
    [createPreviews],
  )

  // Remove file from selection
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const newFiles = prev.filter((file) => file.id !== id)
      // Revoke object URLs
      const removedFile = prev.find((file) => file.id === id)
      if (removedFile) URL.revokeObjectURL(removedFile.preview)
      return newFiles
    })
  }

  // Clean up preview URLs
  React.useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <div className='container mx-auto p-4'>
      {/* Dropzone Area */}
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
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
          multiple
          accept='*' // Accept all file types
        />

        <div className='flex flex-col items-center justify-center gap-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
          <div>
            <p className='font-medium'>Drag & drop files here</p>
            <p className='text-sm text-gray-500'>or click to browse</p>
          </div>
          <p className='text-sm text-gray-500'>Supports all file types</p>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className='mt-6'>
          <h3 className='mb-4 text-lg font-medium'>Selected Files ({files.length})</h3>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {files.map((file) => (
              <div
                key={file.id}
                className='overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md'
              >
                {/* Preview Container */}
                <div className='relative flex aspect-square items-center justify-center bg-gray-100'>
                  {file.type.startsWith('image/') ? (
                    <img src={file.preview} alt={file.name} className='h-full w-full object-cover' />
                  ) : (
                    <div className='flex flex-col items-center p-4'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-12 w-12 text-gray-400'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      <span className='mt-2 break-words text-center text-xs text-gray-500'>{file.name}</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                    className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>

                {/* File Info */}
                <div className='bg-white p-3'>
                  <p className='truncate text-sm font-medium'>{file.name}</p>
                  <p className='text-xs text-gray-500'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'Unknown type'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropzone
