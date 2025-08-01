import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { fast2SMSVerificationService } from '@/services/fast2sms-verification.service'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Send OTP via Fast2SMS
    const result = await fast2SMSVerificationService.sendOTP(phoneNumber)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 })
  }
}

// Export for use in verification
// export { otpStore }
