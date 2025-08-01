// In-memory storage for OTP (in production, use Redis or database)
export const otpStore = new Map<string, { otp: string; expiresAt: number }>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}
