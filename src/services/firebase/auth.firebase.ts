import type { User } from 'firebase/auth'

import {
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getCurrentUser,
  onAuthStateChange,
  sendPasswordReset,
  confirmPasswordResetCode,
  updateUserProfile,
} from '@/libs/firebase/auth'

// Firebase Auth Service
export class FirebaseAuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await signUpWithEmail(email, password, displayName)
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code),
      }
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmail(email, password)
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code),
      }
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOutUser()
      return {
        success: true,
        message: 'Signed out successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to sign out',
      }
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return getCurrentUser()
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChange(callback)
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordReset(email)
      return {
        success: true,
        message: 'Password reset email sent successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code),
      }
    }
  }

  // Confirm password reset
  async confirmPasswordReset(code: string, newPassword: string) {
    try {
      await confirmPasswordResetCode(code, newPassword)
      return {
        success: true,
        message: 'Password reset successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.code),
      }
    }
  }

  // Update user profile
  async updateProfile(updates: { displayName?: string; photoURL?: string }) {
    try {
      await updateUserProfile(updates)
      return {
        success: true,
        message: 'Profile updated successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update profile',
      }
    }
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      default:
        return 'An error occurred. Please try again'
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService()
