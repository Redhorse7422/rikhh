import { userFirebaseService } from './firebase/users.firebase'

interface RegisterUserData {
  name: string
  email: string
  phoneNumber: string
  type: 'buyer' | 'seller'
  // Address data
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

interface RegisterResponse {
  success: boolean
  message: string
  user?: any
}

export const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
  try {
    // Check if user already exists by phone number
    const existingUserByPhone = await userFirebaseService.checkUserExistsByPhone(userData.phoneNumber)
    if (existingUserByPhone) {
      return {
        success: false,
        message: 'User with this phone number already exists',
      }
    }

    // Check if user already exists by email
    const existingUserByEmail = await userFirebaseService.checkUserExistsByEmail(userData.email)
    if (existingUserByEmail) {
      return {
        success: false,
        message: 'User with this email already exists',
      }
    }

    // Create user in Firebase
    const userId = await userFirebaseService.createUser(userData)

    // Get the created user
    const createdUser = await userFirebaseService.getUserByUid(userId)

    return {
      success: true,
      message: 'User registered successfully',
      user: createdUser,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: 'An error occurred during registration',
    }
  }
}
