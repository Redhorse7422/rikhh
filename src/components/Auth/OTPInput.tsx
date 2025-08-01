'use client'

import { useState, useRef, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { otpManagerService } from '@/services/otp-manager.service'

interface OTPInputProps {
  phoneNumber: string
  onVerificationSuccess: (phoneNumber: string) => void
  onResendOTP: () => void
  isLoading?: boolean
}

interface OTPForm {
  otp: string
}

export const OTPInput: React.FC<OTPInputProps> = ({
  phoneNumber,
  onVerificationSuccess,
  onResendOTP,
  isLoading = false,
}) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const { showToast } = useToast()

  const otpForm = useForm<OTPForm>({
    defaultValues: {
      otp: '',
    },
  })

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const startResendTimer = () => {
    setResendTimer(60) // 60 seconds
  }

  const handleVerifyOTP = async (data: OTPForm) => {
    try {
      setIsVerifying(true)

      console.log('OTPInput - Verifying OTP for phone:', phoneNumber)
      console.log('OTPInput - Entered OTP:', data.otp)

      // Verify OTP using OTP manager
      const isValid = otpManagerService.verifyOTP(phoneNumber, data.otp)

      if (!isValid) {
        showToast('Invalid OTP. Please try again.', 'error')
        return
      }

      showToast('OTP verified successfully!', 'success')
      onVerificationSuccess(phoneNumber)
    } catch (error) {
      logger.error('OTP verification error:', error)
      showToast('An error occurred during verification', 'error')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      // Generate new OTP and send via Fast2SMS API
      const otp = otpManagerService.generateAndStoreOTP(phoneNumber)
      
      const params = new URLSearchParams({
        authorization: '3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND',
        sender_id: 'WORCVZ',
        message: '177690',
        variables_values: otp,
        route: 'dlt',
        numbers: phoneNumber,
      })
      
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params}`, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.return) {
        showToast(result.message?.join(', ') || 'Failed to resend OTP', 'error')
        return
      }

      showToast('OTP resent successfully!', 'success')
      startResendTimer()
      onResendOTP()
    } catch (error) {
      logger.error('Resend OTP error:', error)
      showToast('Failed to resend OTP', 'error')
    }
  }

  return (
    <div className='space-y-3'>
      <div className='text-center'>
        <p className='text-sm text-gray-600'>Enter the 6-digit code sent to</p>
        <p className='font-medium text-gray-900'>{phoneNumber}</p>
      </div>

      <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className='space-y-3'>
        <TextField
          control={otpForm.control}
          name='otp'
          label='OTP Code'
          placeholder='Enter 6-digit OTP'
          rules={{
            required: 'OTP is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'Please enter a valid 6-digit OTP',
            },
          }}
        />

        <Button
          type='submit'
          label={isVerifying ? 'Verifying...' : 'Verify OTP'}
          disabled={isVerifying || isLoading}
          className='w-full'
        />
      </form>

      <div className='text-center'>
        {resendTimer > 0 ? (
          <p className='text-sm text-gray-500'>Resend OTP in {resendTimer} seconds</p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className='text-sm text-primary hover:underline disabled:text-gray-400'
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}
