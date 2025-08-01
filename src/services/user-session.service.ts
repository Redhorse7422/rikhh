import { userFirebaseService } from './firebase/users.firebase'

// Define the user interface locally since it's not exported from users.firebase.ts
interface FirestoreUser {
  uid: string
  name: string
  email: string
  phone: string
  provider: 'PHONE' | 'EMAIL' | 'GOOGLE' | 'FACEBOOK'
  status: 'approved' | 'pending' | 'rejected' | 'blocked'
  isApproved: boolean
  isBlocked: boolean
  isDeleteMarked: boolean
  image_url?: string
  address?: string
  createdAt?: any
  updatedAt?: any
}

export interface UserSession {
  user: FirestoreUser
  isAuthenticated: boolean
  loginTime: number
}

class UserSessionService {
  private sessionKey = 'user_session'
  private sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours

  // Store user session in localStorage
  setUserSession(user: FirestoreUser): void {
    const session: UserSession = {
      user,
      isAuthenticated: true,
      loginTime: Date.now(),
    }

    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session))
      console.log('User session stored:', user.name)
    } catch (error) {
      console.error('Failed to store user session:', error)
    }
  }

  // Get current user session
  getUserSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.sessionKey)
      if (!sessionData) return null

      const session: UserSession = JSON.parse(sessionData)

      // Check if session is expired
      if (Date.now() - session.loginTime > this.sessionTimeout) {
        this.clearUserSession()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get user session:', error)
      return null
    }
  }

  // Get current user
  getCurrentUser(): FirestoreUser | null {
    const session = this.getUserSession()
    return session?.user || null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const session = this.getUserSession()
    return session?.isAuthenticated || false
  }

  // Clear user session (logout)
  clearUserSession(): void {
    try {
      localStorage.removeItem(this.sessionKey)
      console.log('User session cleared')
    } catch (error) {
      console.error('Failed to clear user session:', error)
    }
  }

  // Refresh user data from Firebase
  async refreshUserData(phoneNumber: string): Promise<FirestoreUser | null> {
    try {
      const user = await userFirebaseService.getUserByPhone(phoneNumber)
      if (user) {
        // Update session with fresh data
        this.setUserSession(user)
        return user
      }
      return null
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      return null
    }
  }

  // Login user with phone number (after OTP verification)
  async loginUser(phoneNumber: string): Promise<{ success: boolean; user?: FirestoreUser; error?: string }> {
    try {
      const user = await userFirebaseService.getUserByPhone(phoneNumber)

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Store user session
      this.setUserSession(user)

      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  // Logout user
  logoutUser(): void {
    this.clearUserSession()
  }
}

export const userSessionService = new UserSessionService()
