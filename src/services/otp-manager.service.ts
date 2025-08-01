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

export class OTPManagerService {
  // Generate and store OTP
  generateAndStoreOTP(phoneNumber: string): string {
    const cleanPhone = phoneNumber.replace(/\D/g, '')

    if (!isValidPhoneNumber(cleanPhone)) {
      throw new Error('Invalid phone number format')
    }

    const otp = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(cleanPhone, { otp, expiresAt })
    
    console.log('Stored OTP for phone:', cleanPhone, 'OTP:', otp)
    console.log('Current OTP store keys:', Array.from(otpStore.keys()))

    return otp
  }

  // Verify OTP
  verifyOTP(phoneNumber: string, otp: string): boolean {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const storedData = otpStore.get(cleanPhone)

    console.log('Phone Number ==> ', phoneNumber)
    console.log('Clean Phone ==> ', cleanPhone)
    console.log('Store Data ==> ', storedData)
    console.log('All stored keys:', Array.from(otpStore.keys()))

    if (!storedData) {
      return false
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanPhone)
      return false
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return false
    }

    // Remove OTP after successful verification
    otpStore.delete(cleanPhone)
    return true
  }

  // Check if OTP exists
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

  // Remove OTP
  removeOTP(phoneNumber: string): void {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    otpStore.delete(cleanPhone)
  }

  // Debug method to get all stored OTPs
  getAllStoredOTPs(): Map<string, { otp: string; expiresAt: number }> {
    return new Map(otpStore)
  }

  // Debug method to clear all OTPs
  clearAllOTPs(): void {
    otpStore.clear()
  }
}

export const otpManagerService = new OTPManagerService()
