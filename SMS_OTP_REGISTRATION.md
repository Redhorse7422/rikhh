# SMS OTP Registration System

This document describes the implementation of SMS OTP-based user registration using Fast2SMS API.

## Overview

The system replaces password-based registration with SMS OTP verification. Users provide their phone number during registration, receive an OTP via SMS, and verify it to complete their account creation.

## Components

### 1. Fast2SMS Service (`src/services/fast2sms.service.ts`)
- Handles communication with Fast2SMS API
- Supports both POST and GET methods
- Manages API authentication and request formatting

### 2. Fast2SMS Verification Service (`src/services/fast2sms-verification.service.ts`)
- Complete OTP management using Fast2SMS API
- In-memory storage for OTP codes (use Redis in production)
- OTP generation, sending, and verification
- Phone number validation and OTP expiration handling

### 3. Firebase User Service (`src/services/firebase/users.firebase.ts`)
- Handles user registration and management in Firestore
- Follows the same pattern as products service
- Supports CRUD operations for users
- Includes user validation and duplicate checking

### 4. API Routes
- `/api/auth/send-otp` - Sends OTP to phone number
- `/api/auth/verify-otp` - Verifies OTP and marks phone as verified

### 5. UI Components
- `LoginPopup.tsx` - Updated registration form with phone number input
- `OTPInput.tsx` - OTP verification interface with resend functionality

### 6. User Service (`src/services/user.services.ts`)
- Updated to use Firebase instead of external API
- Handles user registration with phone verification
- Includes duplicate checking for phone and email

## Fast2SMS Configuration

### API Details
- **Authorization Key**: `3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND`
- **Sender ID**: `WORCVZ`
- **Template ID**: `177690`
- **Base URL**: `https://www.fast2sms.com/dev/bulkV2`

### Request Format

#### POST Method
```json
{
  "route": "dlt",
  "sender_id": "WORCVZ",
  "message": "177690",
  "variables_values": "OTP_CODE",
  "numbers": "PHONE_NUMBER",
  "flash": 0
}
```

#### GET Method
```
https://www.fast2sms.com/dev/bulkV2?authorization=API_KEY&route=dlt&sender_id=WORCVZ&message=177690&variables_values=OTP_CODE&flash=0&numbers=PHONE_NUMBER
```

## Authentication Flow

### **Registration Flow:**

1. **User fills registration form** with:
   - Full Name
   - Email
   - Phone Number
   - **Address Information:**
     - Street Address
     - City
     - State
     - ZIP Code
     - (Country is automatically set to India)

2. **System sends OTP** via Fast2SMS API

3. **User enters OTP** in verification screen

4. **System verifies OTP** and creates user account in Firebase Firestore with address data

5. **User is redirected** to sign-in page

### **Login Flow:**

1. **User enters phone number** in login form

2. **System sends OTP** via Fast2SMS API (POST/GET method)

3. **User enters OTP** in verification screen

4. **System verifies OTP** using Fast2SMS verification service and fetches user from Firebase Firestore

5. **User is authenticated** and logged in

## Firebase User Structure

Based on your Firestore screenshot, users are stored with the following fields:
- `uid`: Document ID (auto-generated)
- `name`: Full name (firstName + lastName)
- `email`: User's email address
- `phone`: Phone number (verified via OTP)
- `provider`: Authentication provider ('PHONE', 'EMAIL', 'GOOGLE', 'FACEBOOK')
- `status`: User status ('approved', 'pending', 'rejected', 'blocked')
- `isApproved`: Boolean approval status
- `isBlocked`: Boolean blocked status
- `isDeleteMarked`: Soft delete flag
- `image_url`: Profile image URL
- `address`: Complete address as a single string (e.g., "123 Test Street, Mumbai, Maharashtra 400001, India" - always includes India)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Security Features

- OTP expires after 10 minutes
- OTP is deleted after successful verification
- Phone number validation (Indian format)
- Rate limiting can be added for OTP requests

## Production Considerations

1. **Replace in-memory OTP store** with Redis or database
2. **Add rate limiting** for OTP requests
3. **Implement proper error handling** for SMS delivery failures
4. **Add phone number verification** for international numbers
5. **Consider backup SMS providers** for reliability

## Testing

### Fast2SMS API Test
Use the test script `scripts/test-fast2sms.js` to verify API integration:

```bash
node scripts/test-fast2sms.js
```

### Firebase User Registration Test
Use the test script `scripts/test-firebase-user-registration.js` to verify Firebase integration:

```bash
node scripts/test-firebase-user-registration.js
```

**Note**: 
- Replace the test phone number with a real number for actual testing
- Update the Firebase configuration in the test script with your actual Firebase config

## Environment Variables

Add these to your environment configuration:

```env
FAST2SMS_API_KEY=3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND
FAST2SMS_SENDER_ID=WORCVZ
FAST2SMS_TEMPLATE_ID=177690
```

## User Experience

- Clean, intuitive interface
- Real-time validation
- Clear error messages
- Resend OTP functionality with cooldown
- Mobile-responsive design

## Error Handling

The system handles various error scenarios:
- Invalid phone numbers
- SMS delivery failures
- Expired OTPs
- Invalid OTP codes
- Network errors

## Future Enhancements

1. **Voice OTP** as fallback
2. **Email OTP** as alternative
3. **Biometric authentication** integration
4. **Multi-factor authentication** support
5. **Social login** integration 