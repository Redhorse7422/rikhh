'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { OTPInput } from '@/components/Auth/OTPInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { userFirebaseService } from '@/services/firebase/users.firebase'
import { otpManagerService } from '@/services/otp-manager.service'
import { userSessionService } from '@/services/user-session.service'
import { registerUser } from '@/services/user.services'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface SigninForm {
  phoneNumber: string
}

interface SignupForm {
  name: string
  email: string
  phoneNumber: string
  // Address fields
  street: string
  city: string
  state: string
  zipCode: string
}

type AuthMode = 'signin' | 'signup' | 'otp'

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  // Signin form
  const signinForm = useForm<SigninForm>({
    defaultValues: {
      phoneNumber: '',
    },
  })

  // Signup form
  const signupForm = useForm<SignupForm>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      // Address defaults
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  const onSigninSubmit = async (data: SigninForm) => {
    try {
      setIsLoading(true)

      // Generate OTP and send for login via Fast2SMS API
      console.log('Login - Original phone number:', data.phoneNumber)
      const otp = otpManagerService.generateAndStoreOTP(data.phoneNumber)
      
      const params = new URLSearchParams({
        authorization: '3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND',
        sender_id: 'WORCVZ',
        message: '177690',
        variables_values: otp,
        route: 'dlt',
        numbers: data.phoneNumber,
      })
      
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params}`, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.return) {
        logger.error('OTP send failed:', result.message || 'Failed to send OTP')
        showToast(result.message?.join(', ') || 'Failed to send OTP. Please try again.', 'error')
        return
      }

      setPhoneNumberForOTP(data.phoneNumber)
      setAuthMode('otp')
      showToast('OTP sent successfully!', 'success')
    } catch (error) {
      logger.error('Signin error:', error)
      showToast('An error occurred during signin. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const [phoneNumberForOTP, setPhoneNumberForOTP] = useState<string>('')

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true)

      // Generate OTP and send via Fast2SMS API
      console.log('Signup - Original phone number:', data.phoneNumber)
      const otp = otpManagerService.generateAndStoreOTP(data.phoneNumber)
      
      const params = new URLSearchParams({
        authorization: '3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND',
        sender_id: 'WORCVZ',
        message: '177690',
        variables_values: otp,
        route: 'dlt',
        numbers: data.phoneNumber,
      })
      
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params}`, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.return) {
        logger.error('OTP send failed:', result.message || 'Failed to send OTP')
        showToast(result.message?.join(', ') || 'Failed to send OTP. Please try again.', 'error')
        return
      }

      setPhoneNumberForOTP(data.phoneNumber)
      setAuthMode('otp')
      showToast('OTP sent successfully!', 'success')
    } catch (error) {
      logger.error('Signup error:', error)
      showToast('An error occurred during signup. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerificationSuccess = async (verifiedPhoneNumber: string) => {
    try {
      setIsLoading(true)

      // Check if this is a signup or login flow
      const signupFormData = signupForm.getValues()
      const isSignupFlow = signupFormData.name && signupFormData.email

      if (isSignupFlow) {
        // This is a signup flow - register the user
        const result = await registerUser({
          name: signupFormData.name,
          email: signupFormData.email,
          phoneNumber: verifiedPhoneNumber,
          type: 'buyer',
          // Address data
          street: signupFormData.street,
          city: signupFormData.city,
          state: signupFormData.state,
          zipCode: signupFormData.zipCode,
        })

        if (!result.success) {
          showToast(result.message || 'Signup failed. Please try again.', 'error')
          return
        }

        // After successful registration, login the user
        const loginResult = await userSessionService.loginUser(verifiedPhoneNumber)
        
        if (loginResult.success && loginResult.user) {
          showToast(`Welcome, ${loginResult.user.name}! Account created and logged in successfully.`, 'success')
          handleClose()
          window.location.reload() // Refresh to update UI
        } else {
          showToast('Account created successfully! Please sign in.', 'success')
          signupForm.reset()
          setAuthMode('signin')
        }
      } else {
        // This is a login flow - authenticate user
        const loginResult = await userSessionService.loginUser(verifiedPhoneNumber)
        
        if (!loginResult.success) {
          showToast(loginResult.error || 'User not found. Please sign up first.', 'error')
          setAuthMode('signup')
          return
        }

        // User logged in successfully
        showToast(`Welcome back, ${loginResult.user?.name}!`, 'success')
        handleClose()
        window.location.reload() // Refresh to update UI
      }
    } catch (error) {
      logger.error('OTP verification error:', error)
      showToast('An error occurred during verification. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setAuthMode('signin')
    signinForm.reset()
    signupForm.reset()
    setIsLoading(false)
    onClose()
  }

  const switchToSignup = () => {
    setAuthMode('signup')
    signinForm.reset()
    setIsLoading(false)
  }

  const switchToSignin = () => {
    setAuthMode('signin')
    signupForm.reset()
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' onClick={handleClose} />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              {authMode === 'signin' ? 'Sign In' : authMode === 'otp' ? 'Verify OTP' : 'Create Account'}
            </h2>
            <button
              onClick={handleClose}
              className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            >
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Signin Form */}
          {authMode === 'signin' && (
            <>
              <form onSubmit={signinForm.handleSubmit(onSigninSubmit)} className='space-y-3'>
                <TextField
                  control={signinForm.control}
                  name='phoneNumber'
                  label='Phone Number'
                  placeholder='Enter your phone number'
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  }}
                />
                <Button
                  type='submit'
                  label={isLoading ? 'Sending OTP...' : 'Send OTP'}
                  disabled={isLoading}
                  className='w-full'
                />
              </form>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  Don&apos;t have an account?{' '}
                  <button onClick={switchToSignup} className='text-primary hover:underline'>
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Signup Form */}
          {authMode === 'signup' && (
            <>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className='space-y-3'>
                <TextField
                  control={signupForm.control}
                  name='name'
                  label='Full Name'
                  placeholder='Enter your full name'
                  rules={{ required: 'Full name is required' }}
                />

                <TextField
                  control={signupForm.control}
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='Enter your email'
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                />

                <TextField
                  control={signupForm.control}
                  name='phoneNumber'
                  label='Phone Number'
                  placeholder='Enter your phone number'
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  }}
                />

                {/* Address Section */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium text-gray-700'>Address Information</h3>
                  
                  <TextField
                    control={signupForm.control}
                    name='street'
                    label='Street Address'
                    placeholder='Enter your street address'
                    rules={{ required: 'Street address is required' }}
                  />

                  <div className='grid grid-cols-2 gap-3'>
                    <TextField
                      control={signupForm.control}
                      name='city'
                      label='City'
                      placeholder='Enter your city'
                      rules={{ required: 'City is required' }}
                    />
                    <TextField
                      control={signupForm.control}
                      name='state'
                      label='State'
                      placeholder='Enter your state'
                      rules={{ required: 'State is required' }}
                    />
                  </div>

                  <TextField
                    control={signupForm.control}
                    name='zipCode'
                    label='ZIP Code'
                    placeholder='Enter ZIP code'
                    rules={{ required: 'ZIP code is required' }}
                  />
                </div>

                <Button
                  type='submit'
                  label={isLoading ? 'Sending OTP...' : 'Send OTP'}
                  disabled={isLoading}
                  className='w-full'
                />
              </form>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  Already have an account?{' '}
                  <button onClick={switchToSignin} className='text-primary hover:underline'>
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}

          {/* OTP Verification Form */}
          {authMode === 'otp' && (
            <>
              <div className='space-y-3'>
                <OTPInput
                  phoneNumber={phoneNumberForOTP}
                  onVerificationSuccess={handleOTPVerificationSuccess}
                  onResendOTP={() => {
                    // This will be handled by the OTPInput component
                  }}
                  isLoading={isLoading}
                />
              </div>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  <button onClick={() => setAuthMode('signup')} className='text-primary hover:underline'>
                    ← Back to Signup
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
