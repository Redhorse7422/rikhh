import { fast2SMSService } from './fast2sms.service'

// In-memory storage for OTP (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export class Fast2SMSVerificationService {
  // Send OTP via Fast2SMS
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '')

      if (!isValidPhoneNumber(cleanPhone)) {
        return {
          success: false,
          message: 'Invalid phone number format',
        }
      }

      // Generate OTP
      const otp = generateOTP()
      const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store OTP
      otpStore.set(cleanPhone, { otp, expiresAt })

      // Send OTP via Fast2SMS
      try {
        await fast2SMSService.sendOTP(cleanPhone, otp)

        return {
          success: true,
          message: 'OTP sent successfully',
          otp: otp, // In production, don't return the OTP
        }
      } catch (error) {
        // Remove stored OTP if SMS sending fails
        otpStore.delete(cleanPhone)
        throw error
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      }
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '')

      // Get stored OTP data
      const storedData = otpStore.get(cleanPhone)

      if (!storedData) {
        return {
          success: false,
          message: 'OTP not found. Please request a new OTP.',
        }
      }

      // Check if OTP is expired
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(cleanPhone)
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
        }
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.',
        }
      }

      // Remove OTP after successful verification
      otpStore.delete(cleanPhone)

      return {
        success: true,
        message: 'OTP verified successfully',
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      }
    }
  }

  // Check if OTP exists for phone number
  hasOTP(phoneNumber: string): boolean {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    return otpStore.has(cleanPhone)
  }

  // Get remaining time for OTP
  getOTPTimeRemaining(phoneNumber: string): number {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const storedData = otpStore.get(cleanPhone)

    if (!storedData) return 0

    const remaining = storedData.expiresAt - Date.now()
    return Math.max(0, Math.floor(remaining / 1000)) // Return seconds
  }
}

export const fast2SMSVerificationService = new Fast2SMSVerificationService()
