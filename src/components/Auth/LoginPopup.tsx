'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface SigninForm {
  email: string
  password: string
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const { control, handleSubmit, reset } = useForm<SigninForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SigninForm) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        userType: 'buyer',
        redirect: false,
      })

      if (result?.error) {
        logger.error('Signin failed:', result.error)
        showToast('Invalid credentials. Please try again.', 'error')
        return
      }

      if (result?.ok) {
        showToast('Login successful!', 'success')
        reset()
        onClose()
        // Optionally refresh the page or update the header state
        window.location.reload()
      }
    } catch (error) {
      logger.error('Signin error:', error)
      showToast('An error occurred during signin. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' onClick={onClose} />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>Sign In</h2>
            <button onClick={onClose} className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'>
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <TextField
              control={control}
              name='email'
              label='Email'
              placeholder='Enter your email'
              rules={{ required: 'Email is required' }}
            />
            <TextField
              control={control}
              name='password'
              label='Password'
              type='password'
              placeholder='Enter your password'
              rules={{ required: 'Password is required' }}
            />
            <Button
              type='submit'
              label={isLoading ? 'Signing in...' : 'Sign In'}
              disabled={isLoading}
              className='w-full'
            />
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => {
                  onClose()
                  // TODO: Navigate to sign up page or show sign up popup
                  console.log('Navigate to sign up')
                }}
                className='text-primary hover:underline'
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
