import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { fast2SMSVerificationService } from '@/services/fast2sms-verification.service'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 })
    }

    // Verify OTP using Fast2SMS verification service
    const result = await fast2SMSVerificationService.verifyOTP(phoneNumber, otp)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Failed to verify OTP. Please try again.' }, { status: 500 })
  }
}
